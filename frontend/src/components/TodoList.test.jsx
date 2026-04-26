import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TodoList from './TodoList.jsx';

const mockTodos = [
  { id: '1', description: 'Buy milk', completed: false },
  { id: '2', description: 'Walk dog', completed: true },
];

describe('TodoList', () => {
  it('renders empty state when no todos', () => {
    render(
      <TodoList
        todos={[]}
        onToggleComplete={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('renders todo items', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleComplete={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Walk dog')).toBeInTheDocument();
  });

  it('renders correct number of todos', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleComplete={() => {}}
        onDelete={() => {}}
      />
    );

    const todoItems = screen.getAllByTestId('todo-item');
    expect(todoItems).toHaveLength(2);
  });

  it('renders todos in order', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleComplete={() => {}}
        onDelete={() => {}}
      />
    );

    const descriptions = screen.getAllByTestId('todo-description');
    expect(descriptions[0]).toHaveTextContent('Buy milk');
    expect(descriptions[1]).toHaveTextContent('Walk dog');
  });
});
