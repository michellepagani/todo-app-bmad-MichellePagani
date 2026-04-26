import TodoItem from './TodoItem.jsx';

export default function TodoList({ todos, onToggleComplete, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-state">
        <p>No todos yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
