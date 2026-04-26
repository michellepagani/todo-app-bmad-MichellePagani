import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from './TodoForm.jsx';

describe('TodoForm', () => {
  it('renders input and button', () => {
    const mockOnAddTodo = vi.fn();
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('calls onAddTodo with trimmed description on submit', async () => {
    const user = userEvent.setup();
    const mockOnAddTodo = vi.fn().mockResolvedValue(undefined);
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '  Buy groceries  ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockOnAddTodo).toHaveBeenCalledWith('Buy groceries');
  });

  it('clears input after successful submit', async () => {
    const user = userEvent.setup();
    const mockOnAddTodo = vi.fn().mockResolvedValue(undefined);
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Test todo');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(input.value).toBe('');
  });

  it('disables button when input is empty', () => {
    const mockOnAddTodo = vi.fn();
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });

  it('disables button while submitting', async () => {
    const user = userEvent.setup();
    const mockOnAddTodo = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /add/i });

    await user.type(input, 'Test');
    await user.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByRole('button', { name: /adding/i })).toBeInTheDocument();
  });

  it('prevents submit with only whitespace', async () => {
    const user = userEvent.setup();
    const mockOnAddTodo = vi.fn();
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    await user.type(input, '   ');

    expect(button).toBeDisabled();
    expect(mockOnAddTodo).not.toHaveBeenCalled();
  });

  it('has accessible labels', () => {
    const mockOnAddTodo = vi.fn();
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /add todo/i });

    expect(input).toHaveAttribute('aria-label', 'New todo description');
    expect(button).toHaveAttribute('aria-label', 'Add todo');
  });
});
