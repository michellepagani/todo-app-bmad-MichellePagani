export default function TodoItem({ todo, onToggleComplete, onDelete }) {
  const handleToggle = () => {
    onToggleComplete(todo.id, !todo.completed);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`} data-testid="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="todo-checkbox"
        data-testid="todo-checkbox"
        aria-label={`Mark "${todo.description}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <span className="todo-description" data-testid="todo-description">{todo.description}</span>
      <button
        onClick={handleDelete}
        className="delete-button"
        data-testid="delete-button"
        aria-label={`Delete "${todo.description}"`}
      >
        Delete
      </button>
    </div>
  );
}
