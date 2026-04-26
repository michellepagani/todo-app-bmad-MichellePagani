import { useState } from 'react';

export default function TodoForm({ onAddTodo }) {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddTodo(description.trim());
      setDescription('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form" aria-label="Todo form">
      <label htmlFor="todo-input" className="sr-only">New todo description</label>
      <input
        id="todo-input"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a new todo..."
        disabled={isSubmitting}
        maxLength={200}
        className="todo-input"
        data-testid="todo-input"
        aria-label="New todo description"
      />
      <button
  type="submit"
  disabled={isSubmitting || !description.trim()}
  className="add-button"
  data-testid="add-button"
  aria-label={isSubmitting ? 'Adding' : 'Add todo'}
>
  {isSubmitting ? 'Adding...' : 'Add'}
</button>
    </form>
  );
}
