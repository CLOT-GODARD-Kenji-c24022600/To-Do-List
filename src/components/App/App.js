import React from 'react';
import './App.css';
import { TodoProvider } from '../../context/TodoContext';
import Todo from '../Todo/Todo';

function App() {
  return (
    <TodoProvider>
      <div className="app-container">
        <Todo />
      </div>
    </TodoProvider>
  );
}

export default App;
