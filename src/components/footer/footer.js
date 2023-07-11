// eslint-disable-next-line no-unused-vars
import React from 'react';

import { TasksFilter } from '../tasks-filter';

import './footer.css';

export function Footer({ useFilteredTask, currentFilter, useClearCompleted, todoCount }) {
  return (
    <footer className="footer">
      <span className="todo-count">{todoCount} items left</span>
      <TasksFilter useFilteredTask={useFilteredTask} currentFilter={currentFilter} />
      <button type="button" className="clear-completed" onClick={useClearCompleted}>
        Clear completed
      </button>
    </footer>
  );
}
