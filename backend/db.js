const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

// Determine database path with fallback
let dbPath = process.env.DATABASE_FILE;
if (!dbPath) {
  dbPath = path.join(__dirname, 'data', 'todos.db');
} else {
  // Resolve relative paths from the project root
  dbPath = path.resolve(dbPath);
}

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Created database directory: ${dbDir}`);
}

async function openDatabase() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

module.exports = { openDatabase };
