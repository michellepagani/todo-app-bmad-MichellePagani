const request = require('supertest');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { openDatabase } = require('../db.js');
const { app, initializeServer } = require('../index.js');

dotenv.config();
process.env.DATABASE_FILE = process.env.DATABASE_FILE || path.resolve(__dirname, '..', 'data', 'test-todos.db');
process.env.API_KEY = process.env.API_KEY || 'dev-api-key';

const apiKey = process.env.API_KEY;
let db;

beforeAll(async () => {
  if (!fs.existsSync(path.dirname(process.env.DATABASE_FILE))) {
    fs.mkdirSync(path.dirname(process.env.DATABASE_FILE), { recursive: true });
  }
  await initializeServer();
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
});

beforeEach(async () => {
  await db.run('DELETE FROM todos');
});

afterAll(async () => {
  await db.close();
});

function requestWithAuth() {
  return request(app).set('Authorization', `Bearer ${apiKey}`);
}

describe('Todo API', () => {
  test('GET /health returns ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('GET /todos returns empty list initially with valid auth', async () => {
    const response = await requestWithAuth().get('/todos');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ todos: [] });
  });

  test('GET /todos rejects missing auth', async () => {
    const response = await request(app).get('/todos');
    expect(response.status).toBe(401);
  });

  test('POST /todos creates a new todo', async () => {
    const response = await requestWithAuth()
      .post('/todos')
      .send({ description: 'Test todo' });

    expect(response.status).toBe(201);
    expect(response.body.todo).toMatchObject({
      description: 'Test todo',
      completed: false,
    });
    expect(response.body.todo.id).toBeDefined();
    expect(response.body.todo.createdAt).toBeDefined();
    expect(response.body.todo.updatedAt).toBeDefined();
  });

  test('POST /todos validates description', async () => {
    const response1 = await requestWithAuth().post('/todos').send({});
    expect(response1.status).toBe(400);

    const response2 = await requestWithAuth().post('/todos').send({ description: '' });
    expect(response2.status).toBe(400);

    const response3 = await requestWithAuth()
      .post('/todos')
      .send({ description: 'a'.repeat(201) });
    expect(response3.status).toBe(400);
  });

  test('PATCH /todos/:id updates completion', async () => {
    const createResponse = await requestWithAuth()
      .post('/todos')
      .send({ description: 'Test todo' });
    const todoId = createResponse.body.todo.id;

    const updateResponse = await requestWithAuth()
      .patch(`/todos/${todoId}`)
      .send({ completed: true });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.todo.completed).toBe(true);
    expect(updateResponse.body.todo.updatedAt).not.toBe(createResponse.body.todo.updatedAt);
  });

  test('PATCH /todos/:id validates input', async () => {
    const createResponse = await requestWithAuth()
      .post('/todos')
      .send({ description: 'Test todo' });
    const todoId = createResponse.body.todo.id;

    const response = await requestWithAuth()
      .patch(`/todos/${todoId}`)
      .send({ completed: 'not boolean' });
    expect(response.status).toBe(400);
  });

  test('PATCH /todos/:id returns 404 for non-existent todo', async () => {
    const response = await requestWithAuth()
      .patch('/todos/nonexistent')
      .send({ completed: true });
    expect(response.status).toBe(404);
  });

  test('DELETE /todos/:id removes todo', async () => {
    const createResponse = await requestWithAuth()
      .post('/todos')
      .send({ description: 'Test todo' });
    const todoId = createResponse.body.todo.id;

    const deleteResponse = await requestWithAuth().delete(`/todos/${todoId}`);
    expect(deleteResponse.status).toBe(204);

    const getResponse = await requestWithAuth().get('/todos');
    expect(getResponse.body.todos).toHaveLength(0);
  });

  test('DELETE /todos/:id returns 404 for non-existent todo', async () => {
    const response = await requestWithAuth().delete('/todos/nonexistent');
    expect(response.status).toBe(404);
  });
});
