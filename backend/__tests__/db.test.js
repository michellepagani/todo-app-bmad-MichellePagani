const fs = require('fs');
const path = require('path');
const os = require('os');

describe('Database helper', () => {
  it('resolves DATABASE_FILE env path and creates the directory', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-db-'));
    const nestedPath = path.join(tempDir, 'nested', 'test-todos.db');

    process.env.DATABASE_FILE = nestedPath;
    jest.resetModules();

    const { openDatabase } = require('../db.js');
    const db = await openDatabase();
    await db.close();

    expect(fs.existsSync(path.dirname(nestedPath))).toBe(true);
    expect(fs.existsSync(nestedPath)).toBe(true);

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
