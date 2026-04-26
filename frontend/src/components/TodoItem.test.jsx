import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from './TodoItem.jsx';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    description: 'Test todo',
    completed: false,
  };

  const completedTodo = {
    id: '2',
    description: 'Completed todo',
    completed: true,
  };

  it('renders todo description', () => {
    const mockOnToggleComplete = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('renders checkbox with correct state', () => {
    const mockOnToggleComplete = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByTestId('todo-checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders checked checkbox for completed todo', () => {
    const mockOnToggleComplete = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoItem
        todo={completedTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByTestId('todo-checkbox');
    expect(checkbox).toBeChecked();
  });

  it('applies completed class when todo is completed', () => {
    const mockOnToggleComplete = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoItem
        todo={completedTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const todoItem = screen.getByTestId('todo-item');
    expect(todoItem).toHaveClass('completed');
  });

  it('calls onToggleComplete when checkbox is clicked', async () => {
    const user = userEvent.setup();
    const mockOnToggleComplete = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByTestId('todo-checkbox');
    await user.click(checkbox);

    expect(mockOnToggleComplete).toHaveBeenCalledWith('1', true);
  });

  it('calls onToggleComplete with opposite state on toggle', async () => {
    const user = userEvent.setup();
    const mockOnToggleComplete = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoItem
        todo={completedTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByTestId('todo-checkbox');
    await user.click(checkbox);

    expect(mockOnToggleComplete).toHaveBeenCalledWith('2', false);
  });

  it('renders delete button', () => {
    const mockOnToggleComplete = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnToggleComplete = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('has accessible aria labels', () => {
    const mockOnToggleComplete = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByTestId('todo-checkbox');
    const deleteButton = screen.getByTestId('delete-button');

    expect(checkbox).toHaveAttribute('aria-label', 'Mark "Test todo" as complete');
    expect(deleteButton).toHaveAttribute('aria-label', 'Delete "Test todo"');
  });

  it('updates aria label when todo is completed', () => {
    const mockOnToggleComplete = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoItem
        todo={completedTodo}
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByTestId('todo-checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'Mark "Completed todo" as incomplete');
  });
});
