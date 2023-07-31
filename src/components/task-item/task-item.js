// eslint-disable-next-line no-unused-vars
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

import { TaskTimer } from '../task-timer';

import './task-item.css';

export function TaskItem(props) {
  const {
    description,
    status,
    toggleStatus,
    deleteItem,
    createDate,
    editItem,
    handleChange,
    newLabel,
    changeItem,
    min,
    sec,
    startTimer,
    stopTimer,
  } = props;

  return (
    <>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          onClick={toggleStatus}
          defaultChecked={status !== 'active'}
        />
        <label>
          <span className="title">{description}</span>
          <span className="description">
            <TaskTimer startTimer={startTimer} stopTimer={stopTimer} min={min} sec={sec} />
          </span>
          <span className="created">
            created {formatDistanceToNow(createDate, { includeSeconds: true })} ago
          </span>
        </label>
        <button
          type="button"
          className="icon icon-edit"
          onClick={editItem}
          aria-label="edit button"
        />
        <button
          type="button"
          className="icon icon-destroy"
          onClick={deleteItem}
          aria-label="destroy button"
        />
      </div>
      {status === 'editing' ? (
        <form onSubmit={changeItem}>
          <input
            className="edit"
            name="newLabel"
            type="text"
            value={newLabel}
            onChange={handleChange}
          />
        </form>
      ) : null}
    </>
  );
}

TaskItem.defaultProps = {
  status: 'defaultStatus',
};

TaskItem.propTypes = {
  status: (props, propName, componentName) => {
    const value = props[propName];

    if (typeof value === 'string') {
      return null;
    }

    return new TypeError(`${componentName}: ${propName} must be string`);
  },
};
