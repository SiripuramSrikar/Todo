import './App.css';
import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [todolist, setTodolist] = useState(() => {
    const savedTodos = localStorage.getItem(`todos_${user?.id || 'default'}`);
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`todos_${user.id}`, JSON.stringify(todolist));
    }
  }, [todolist, user]);

  const handleLogin = (userData) => {
    setUser(userData);
    // Load user's todos
    const savedTodos = localStorage.getItem(`todos_${userData.id}`);
    setTodolist(savedTodos ? JSON.parse(savedTodos) : []);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setTodolist([]);
  };

  const saveTodoList = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTodo = {
      id: Date.now(),
      text: formData.get('toname'),
      category: formData.get('category'),
      dueDate: formData.get('dueDate'),
      priority: formData.get('priority'),
      completed: false,
      createdAt: new Date().toISOString()
    };

    if (!todolist.some(todo => todo.text === newTodo.text)) {
      setTodolist([...todolist, newTodo]);
      event.target.reset();
    } else {
      alert("This task is already listed!");
    }
  };

  const filteredTodos = todolist
    .filter(todo => category === 'all' || todo.category === category)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  const categories = ['all', 'work', 'personal', 'shopping', 'health'];

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <div className="app-header">
        <h1>ToDo List</h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      
      <form onSubmit={saveTodoList} className="todo-form">
        <div className="form-group">
          <input
            type="text"
            name="toname"
            placeholder="Add a new task..."
            required
          />
        </div>
        
        <div className="form-group">
          <select name="category" required>
            <option value="">Select Category</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
          </select>
        </div>

        <div className="form-group">
          <input
            type="date"
            name="dueDate"
            required
          />
        </div>

        <div className="form-group">
          <select name="priority" required>
            <option value="">Select Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <button type="submit">Add Task</button>
      </form>

      <div className="filters">
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="sort-options">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      <div className="outerdiv">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            No tasks found. Add a new task to get started!
          </div>
        ) : (
          <ul>
            {filteredTodos.map((todo, index) => (
              <TodolistItems
                key={todo.id}
                todo={todo}
                indexNo={index}
                todolist={todolist}
                setTodolist={setTodolist}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TodolistItems({ todo, indexNo, todolist, setTodolist }) {
  const [status, setStatus] = useState(todo.completed);

  const deleteTask = () => {
    let updatedTasks = todolist.filter((_, i) => i !== indexNo);
    setTodolist(updatedTasks);
  };

  const toggleStatus = () => {
    const updatedTodos = todolist.map((t, i) => {
      if (i === indexNo) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    setTodolist(updatedTodos);
    setStatus(!status);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#4f46e5'; // Indigo
      case 'medium': return '#06b6d4'; // Cyan
      case 'low': return '#22c55e'; // Green
      default: return '#64748b'; // Slate
    }
  };

  return (
    <li 
      className={`${status ? 'completeTodo' : ''} priority-${todo.priority}`}
      onClick={toggleStatus}
    >
      <div className="todo-content">
        <span className="todo-number">{indexNo + 1}.</span>
        <span className="todo-text">{todo.text}</span>
        <span className="todo-category">{todo.category}</span>
        <span className="todo-date">
          {new Date(todo.dueDate).toLocaleDateString()}
        </span>
        <span 
          className="todo-priority"
          style={{ backgroundColor: getPriorityColor(todo.priority) }}
        >
          {todo.priority}
        </span>
      </div>
      <span className="delete-btn" onClick={(e) => {
        e.stopPropagation();
        deleteTask();
      }}>&times;</span>
    </li>
  );
}

export default App;