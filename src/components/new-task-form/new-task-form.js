// eslint-disable-next-line no-unused-vars
import React from 'react';

import './new-task-form.css';

export function NewTaskForm({ addItemFromForm, handleChange, label }) {
  return (
    <form onSubmit={addItemFromForm}>
      <header className="header">
        <h1>Todo App</h1>
        <input
          className="new-todo"
          name="label"
          placeholder="What needs to be done?"
          onChange={handleChange}
          value={label}
        />
      </header>
    </form>
  );
}
