const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { openDatabase } = require('./db.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const apiKey = process.env.API_KEY || 'dev-api-key';
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',').map((origin) => origin.trim());

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  optionsSuccessStatus: 200,
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

function requireApiKey(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.slice(7);
  if (token !== apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

app.use(cors(corsOptions));
app.use(express.json());
app.use('/todos', apiLimiter, requireApiKey);

// Initialize database
let db;

async function initializeServer() {
  try {
    db = await openDatabase();
    await db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await db.all('SELECT * FROM todos ORDER BY createdAt DESC');
    res.json({ todos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/todos', async (req, res) => {
  const { description } = req.body;

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({ error: 'Description is required and must be a non-empty string' });
  }

  if (description.length > 200) {
    return res.status(400).json({ error: 'Description must be 200 characters or less' });
  }

  try {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    await db.run(
      'INSERT INTO todos (id, description, completed, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
      [id, description.trim(), false, createdAt, updatedAt]
    );

    const todo = { id, description: description.trim(), completed: false, createdAt, updatedAt };
    res.status(201).json({ todo });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean' });
  }

  try {
    const existing = await db.get('SELECT * FROM todos WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updatedAt = new Date().toISOString();
    const newCompleted = completed !== undefined ? completed : existing.completed;

    await db.run(
      'UPDATE todos SET completed = ?, updatedAt = ? WHERE id = ?',
      [newCompleted, updatedAt, id]
    );

    const todo = { ...existing, completed: newCompleted, updatedAt };
    res.json({ todo });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.run('DELETE FROM todos WHERE id = ?', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export app for testing and start server when invoked directly
module.exports = { app, initializeServer };

if (require.main === module) {
  initializeServer().then(() => {
    app.listen(port, () => {
      console.log(`Backend running at http://localhost:${port}`);
    });
  });
}
