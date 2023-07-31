// eslint-disable-next-line no-unused-vars
import React from 'react';

import './tasks-filter.css';

export function TasksFilter({ useFilteredTask, currentFilter }) {
  const filters = ['all', 'active', 'completed'];
  let uniqId = 20;

  const elements = filters.map((item) => {
    uniqId += 1;

    return (
      <li key={uniqId}>
        <button
          type="button"
          className={currentFilter === item ? 'selected' : ''}
          onClick={useFilteredTask}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </button>
      </li>
    );
  });

  return <ul className="filters">{elements}</ul>;
}
