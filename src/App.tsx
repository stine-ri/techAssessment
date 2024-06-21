import React, { useState, useReducer } from 'react';
import './App.css';
// import headDark from './assets/images/bg-desktop-dark.jpg'

interface Todo {
  text: string;
  completed: boolean;
}

type ActionType =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'REMOVE_TODO'; index: number }
  | { type: 'TOGGLE_TODO'; index: number }
  | { type: 'UPDATE_TODO'; index: number; payload: string }
  | { type: 'CLEAR_COMPLETED' };

const initialState: Todo[] = [
  { text: 'Go to the hospital', completed: true },
  { text: 'Run in the park ', completed: false },
  { text: 'Eat a meal ', completed: false },
  { text: 'Sleep for 1 hour in the afternoon', completed: false },
  { text: 'Pick up groceries and cook supper', completed: false },
  { text: 'Drink enough water', completed: false },
];

const reducer = (state: Todo[], action: ActionType): Todo[] => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { text: action.payload, completed: false }];
    case 'REMOVE_TODO':
      return state.filter((_, index) => index !== action.index);
    case 'TOGGLE_TODO':
      return state.map((todo, index) =>
        index === action.index ? { ...todo, completed: !todo.completed } : todo
      );
    case 'UPDATE_TODO':
      return state.map((todo, index) =>
        index === action.index ? { ...todo, text: action.payload } : todo
      );
    case 'CLEAR_COMPLETED':
      return state.filter(todo => !todo.completed);
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [todos, dispatch] = useReducer(reducer, initialState);
  const [inputValue, setInputValue] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (editIndex !== null) {
        dispatch({ type: 'UPDATE_TODO', index: editIndex, payload: inputValue });
        setEditIndex(null);
      } else {
        dispatch({ type: 'ADD_TODO', payload: inputValue });
      }
      setInputValue('');
    }
  };

  const handleEditTodo = (index: number) => {
    setEditIndex(index);
    setInputValue(todos[index].text);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  });

  return (
    <div className="todo-app">
      {/* image{headDark} */}
      <h1>TODO</h1>
      <form onSubmit={handleAddTodo} className="todo-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Currently typing"
        />
        <button type="submit">{editIndex !== null ? 'Update' : 'Add'}</button>
      </form>
      <ul className="todo-list">
        {filteredTodos.map((todo, index) => (
          <li key={index} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <span onClick={() => dispatch({ type: 'TOGGLE_TODO', index })} className="check-circle">
              {todo.completed ? '✔️' : '⭕'}
            </span>
            <span className="todo-text">{todo.text}</span>
            <span onClick={() => handleEditTodo(index)} className="edit-todo">✏️</span>
            <span onClick={() => dispatch({ type: 'REMOVE_TODO', index })} className="remove-todo">
              ❌
            </span>
          </li>
        ))}
      </ul>
      <div className="todo-footer">
        <span>{todos.filter(todo => !todo.completed).length} items left</span>
        <div className="filters">
          <button onClick={() => setFilter('All')} className={filter === 'All' ? 'active' : ''}>All</button>
          <button onClick={() => setFilter('Active')} className={filter === 'Active' ? 'active' : ''}>Active</button>
          <button onClick={() => setFilter('Completed')} className={filter === 'Completed' ? 'active' : ''}>Completed</button>
        </div>
        <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })} className="clear-completed">Clear Completed</button>
      </div>
    </div>
  );
};

export default App;
