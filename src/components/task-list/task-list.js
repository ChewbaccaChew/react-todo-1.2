// eslint-disable-next-line no-unused-vars
import React from 'react';

import { TaskItem } from '../task-item';

import './task-list.css';

export function TaskList(props) {
  const {
    tasks,
    toggleStatus,
    deleteItem,
    editItem,
    handleChange,
    newLabel,
    changeItem,
    startTimer,
    stopTimer,
    resetTodo,
  } = props;

  const elements = tasks.map((item) => {
    const { id, ...itemsProps } = item;

    return (
      <li key={id} className={item.status}>
        <TaskItem
          {...itemsProps}
          toggleStatus={() => toggleStatus(id)}
          deleteItem={() => deleteItem(id)}
          editItem={() => editItem(id)}
          handleChange={handleChange}
          newLabel={newLabel}
          changeItem={(evt) => changeItem(evt, id)}
          startTimer={() => startTimer(id)}
          stopTimer={() => stopTimer(id)}
          resetTodo={(evt) => resetTodo(evt)}
        />
      </li>
    );
  });

  return <ul className="todo-list">{elements}</ul>;
}
