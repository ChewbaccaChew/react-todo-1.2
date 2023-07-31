// eslint-disable-next-line no-unused-vars
import React from 'react';

import './new-task-form.css';

export function NewTaskForm(props) {
  const { addItemFromForm, handleChange, label, min, sec } = props;

  return (
    <form className="new-todo-form" onSubmit={addItemFromForm}>
      <header className="header">
        <h1>Todo App</h1>
        <input
          className="new-todo"
          name="label"
          placeholder="What needs to be done?"
          onChange={handleChange}
          value={label}
          required
        />
        <input
          className="new-todo-form__timer"
          name="min"
          placeholder="min"
          onChange={handleChange}
          value={min}
          pattern="^(?:[1-9]|[1-5][0-9]|60)$"
          required
        />
        <input
          className="new-todo-form__timer"
          name="sec"
          placeholder="sec"
          onChange={handleChange}
          value={sec}
          pattern="^(?:[1-9]|[1-5][0-9]|60)$"
          required
        />
        <button type="submit" aria-label="submit button" />
      </header>
    </form>
  );
}
