import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../components/TodoItem.jsx';

const mockTodo = {
  id: '1',
  description: 'Test todo',
  completed: false,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
};

describe('TodoItem', () => {
  it('renders todo description and controls', () => {
    const mockToggle = vi.fn();
    const mockDelete = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={mockToggle}
        onDelete={mockDelete}
      />
    );

    expect(screen.getByText('Test todo')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onToggleComplete when checkbox is clicked', () => {
    const mockToggle = vi.fn();
    const mockDelete = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={mockToggle}
        onDelete={mockDelete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockToggle).toHaveBeenCalledWith('1', true);
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockToggle = vi.fn();
    const mockDelete = vi.fn();
    render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={mockToggle}
        onDelete={mockDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockDelete).toHaveBeenCalledWith('1');
  });

  it('shows completed state', () => {
    const completedTodo = { ...mockTodo, completed: true };
    const mockToggle = vi.fn();
    const mockDelete = vi.fn();
    render(
      <TodoItem
        todo={completedTodo}
        onToggleComplete={mockToggle}
        onDelete={mockDelete}
      />
    );

    const description = screen.getByText('Test todo');
    expect(description).toHaveClass('todo-description');
    // Note: CSS classes are applied, but we can't easily test strikethrough in RTL
  });
});
