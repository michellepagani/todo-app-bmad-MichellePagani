import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './services/api.js';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos();
      setTodos(data.todos);
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (description) => {
    try {
      const data = await createTodo(description);
      setTodos((prev) => [data.todo, ...prev]);
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const data = await updateTodo(id, { completed });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? data.todo : todo))
      );
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };

  return (
    <div className="app">
      <h1>Todo App</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      {error ? (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      ) : null}
      {loading ? (
        <div className="loading">Loading todos...</div>
      ) : (
        <TodoList
          todos={todos}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTodo}
        />
      )}
    </div>
  );
}
