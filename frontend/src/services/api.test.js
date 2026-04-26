import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from './api.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchTodos', () => {
    it('fetches todos from API', async () => {
      const mockTodos = [
        { id: '1', description: 'Test', completed: false },
      ];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ todos: mockTodos }),
      });

      const result = await fetchTodos();

      expect(result.todos).toEqual(mockTodos);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos')
      );
    });

    it('throws error on failed fetch', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchTodos()).rejects.toThrow('Failed to fetch todos');
    });
  });

  describe('createTodo', () => {
    it('creates todo with description', async () => {
      const mockTodo = { id: '1', description: 'New todo', completed: false };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ todo: mockTodo }),
      });

      const result = await createTodo('New todo');

      expect(result.todo).toEqual(mockTodo);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: 'New todo' }),
        }
      );
    });

    it('throws error on failed create', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(createTodo('Test')).rejects.toThrow('Failed to create todo');
    });
  });

  describe('updateTodo', () => {
    it('updates todo with new values', async () => {
      const mockTodo = { id: '1', description: 'Test', completed: true };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ todo: mockTodo }),
      });

      const result = await updateTodo('1', { completed: true });

      expect(result.todo).toEqual(mockTodo);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos/1'),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true }),
        }
      );
    });

    it('throws error on failed update', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(updateTodo('1', { completed: true })).rejects.toThrow(
        'Failed to update todo'
      );
    });
  });

  describe('deleteTodo', () => {
    it('deletes todo by id', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await deleteTodo('1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos/1'),
        {
          method: 'DELETE',
        }
      );
    });

    it('throws error on failed delete', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(deleteTodo('1')).rejects.toThrow('Failed to delete todo');
    });
  });
});
