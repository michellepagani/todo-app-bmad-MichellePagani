import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '../components/TodoForm.jsx';

describe('TodoForm', () => {
  it('renders input and button', () => {
    const mockOnAdd = vi.fn();
    render(<TodoForm onAddTodo={mockOnAdd} />);

    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
  });

  it('calls onAddTodo when form is submitted', async () => {
    const mockOnAdd = vi.fn().mockResolvedValue();
    const user = userEvent.setup();
    render(<TodoForm onAddTodo={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: /add todo/i });

    await user.type(input, 'Test todo');
    await user.click(button);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith('Test todo');
    });
  });

  it('does not submit empty description', async () => {
    const mockOnAdd = vi.fn();
    const user = userEvent.setup();
    render(<TodoForm onAddTodo={mockOnAdd} />);

    const button = screen.getByRole('button', { name: /add todo/i });
    await user.click(button);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('clears input after successful submission', async () => {
    const mockOnAdd = vi.fn().mockResolvedValue();
    const user = userEvent.setup();
    render(<TodoForm onAddTodo={mockOnAdd} />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: /add todo/i });

    await user.type(input, 'Test todo');
    await user.click(button);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});