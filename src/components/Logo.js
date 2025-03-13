import React from 'react';
import './Logo.css';

function Logo() {
  return (
    <div className="logo-container">
      <div className="logo-icon">✓</div>
      <div className="logo-text">
        <span className="logo-title">Todo</span>
        <span className="logo-subtitle">Task Manager</span>
      </div>
    </div>
  );
}

export default Logo; 