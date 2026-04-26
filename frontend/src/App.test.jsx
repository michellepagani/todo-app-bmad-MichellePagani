import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import * as api from './services/api.js';

vi.mock('./services/api.js');

describe('App', () => {
  const mockTodos = [
    { id: '1', description: 'Buy milk', completed: false },
    { id: '2', description: 'Walk dog', completed: true },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders app title', async () => {
    api.fetchTodos.mockResolvedValue({ todos: [] });
    render(<App />);

    await waitFor(() => {
      expect(api.fetchTodos).toHaveBeenCalled();
    });

    expect(screen.getByRole('heading', { name: /todo app/i })).toBeInTheDocument();
  });

  it('shows loading state on mount', () => {
    api.fetchTodos.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<App />);

    expect(screen.getByText(/loading todos/i)).toBeInTheDocument();
  });

  it('loads and displays todos on mount', async () => {
    api.fetchTodos.mockResolvedValue({ todos: mockTodos });
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toBeInTheDocument();
      expect(screen.getByText('Walk dog')).toBeInTheDocument();
    });
  });

  it('shows empty state when no todos', async () => {
    api.fetchTodos.mockResolvedValue({ todos: [] });
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('shows error message on fetch failure', async () => {
    api.fetchTodos.mockRejectedValue(new Error('Network error'));
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load todos/i)).toBeInTheDocument();
    });
  });

  it('adds todo and updates list', async () => {
    const user = userEvent.setup();
    api.fetchTodos.mockResolvedValue({ todos: [] });
    api.createTodo.mockResolvedValue({
      todo: { id: '1', description: 'New todo', completed: false },
    });

    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    // Add a todo
    const input = screen.getByRole('textbox');
    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /^add/i }));

    // Verify todo appears
    await waitFor(() => {
      expect(screen.getByText('New todo')).toBeInTheDocument();
    });
    expect(api.createTodo).toHaveBeenCalledWith('New todo');
  });

  it('shows error when adding todo fails', async () => {
    const user = userEvent.setup();
    api.fetchTodos.mockResolvedValue({ todos: [] });
    api.createTodo.mockRejectedValue(new Error('Failed'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /^add/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to add todo/i)).toBeInTheDocument();
    });
  });

  it('toggles todo completion', async () => {
    const user = userEvent.setup();
    api.fetchTodos.mockResolvedValue({ todos: mockTodos });
    api.updateTodo.mockResolvedValue({
      todo: { id: '1', description: 'Buy milk', completed: true },
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByTestId('todo-checkbox');
    await user.click(checkboxes[0]); // First todo is incomplete

    await waitFor(() => {
      expect(api.updateTodo).toHaveBeenCalledWith('1', { completed: true });
    });
  });

  it('shows error when toggle fails', async () => {
    const user = userEvent.setup();
    api.fetchTodos.mockResolvedValue({ todos: mockTodos });
    api.updateTodo.mockRejectedValue(new Error('Failed'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByTestId('todo-checkbox');
    await user.click(checkboxes[0]);

    await waitFor(() => {
      expect(screen.getByText(/failed to update todo/i)).toBeInTheDocument();
    });
  });

  it('deletes todo and removes from list', async () => {
    const user = userEvent.setup();
    api.fetchTodos.mockResolvedValue({ todos: mockTodos });
    api.deleteTodo.mockResolvedValue({});

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTestId('delete-button');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(api.deleteTodo).toHaveBeenCalledWith('1');
    });

    // Verify todo is removed from list
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
  });

  it('shows error when delete fails', async () => {
    const user = userEvent.setup();
    api.fetchTodos.mockResolvedValue({ todos: mockTodos });
    api.deleteTodo.mockRejectedValue(new Error('Failed'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTestId('delete-button');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/failed to delete todo/i)).toBeInTheDocument();
    });

    // Todo should still be in list
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  it('renders form for adding todos', async () => {
    api.fetchTodos.mockResolvedValue({ todos: [] });
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^add/i })).toBeInTheDocument();
    });
  });

  it('handles todos with special characters', async () => {
    const specialTodo = {
      id: '1',
      description: 'Buy "organic" milk & eggs! 🛒',
      completed: false,
    };
    api.fetchTodos.mockResolvedValue({ todos: [specialTodo] });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Buy "organic" milk & eggs! 🛒')).toBeInTheDocument();
    });
  });
});
