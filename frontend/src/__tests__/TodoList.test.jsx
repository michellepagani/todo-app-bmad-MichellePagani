import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TodoList from '../components/TodoList.jsx';

const mockTodos = [
  {
    id: '1',
    description: 'First todo',
    completed: false,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    description: 'Second todo',
    completed: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
];

describe('TodoList', () => {
  it('renders all todos', () => {
    const mockToggle = vi.fn();
    const mockDelete = vi.fn();
    render(
      <TodoList
        todos={mockTodos}
        onToggleComplete={mockToggle}
        onDelete={mockDelete}
      />
    );

    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.getByText('Second todo')).toBeInTheDocument();
  });

  it('renders empty state when no todos', () => {
    const mockToggle = vi.fn();
    const mockDelete = vi.fn();
    render(
      <TodoList
        todos={[]}
        onToggleComplete={mockToggle}
        onDelete={mockDelete}
      />
    );

    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
  });
});
