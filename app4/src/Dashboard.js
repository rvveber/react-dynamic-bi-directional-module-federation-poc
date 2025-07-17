import React, { useState } from 'react';
import moment from 'moment';

export default function Dashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review plugin architecture', completed: true, created: moment().subtract(2, 'hours') },
    { id: 2, text: 'Implement universal injection', completed: true, created: moment().subtract(1, 'hour') },
    { id: 3, text: 'Test dynamic loading', completed: false, created: moment().subtract(30, 'minutes') },
  ]);

  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
          created: moment()
        }
      ]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div
      style={{
        borderRadius: '8px',
        padding: '2em',
        backgroundColor: '#6f42c1',
        color: 'white',
        marginBottom: '1em',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h2>📋 App 4 Dashboard - Task Manager</h2>
      <p>
        <strong>Dynamic plugin with state management</strong>
      </p>

      {/* Add new task */}
      <div style={{ marginBottom: '1.5em', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '4px',
            border: 'none',
            fontSize: '1rem',
          }}
        />
        <button
          onClick={addTask}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Add
        </button>
      </div>

      {/* Task list */}
      <div style={{ marginBottom: '1em' }}>
        <h4 style={{ margin: '0 0 1em 0' }}>Tasks ({tasks.length})</h4>
        {tasks.map(task => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.8em',
              padding: '0.8em',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '6px',
              textDecoration: task.completed ? 'line-through' : 'none',
              opacity: task.completed ? 0.7 : 1,
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              style={{ marginRight: '0.8em', transform: 'scale(1.2)' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1rem', marginBottom: '0.2em' }}>
                {task.text}
              </div>
              <div style={{ fontSize: '0.8em', opacity: 0.8 }}>
                Created {task.created.fromNow()}
              </div>
            </div>
            <button
              onClick={() => removeTask(task.id)}
              style={{
                padding: '0.3rem 0.6rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ 
        marginTop: '1.5em', 
        padding: '1em', 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: '6px' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Completed: {tasks.filter(t => t.completed).length}</span>
          <span>Pending: {tasks.filter(t => !t.completed).length}</span>
          <span>Total: {tasks.length}</span>
        </div>
      </div>

      <p style={{ fontSize: '0.9em', marginTop: '1em', opacity: 0.9 }}>
        ✨ This dashboard is a dynamic plugin loaded from JSON configuration!
      </p>
    </div>
  );
}
