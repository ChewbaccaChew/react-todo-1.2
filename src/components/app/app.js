// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';

import { NewTaskForm } from '../new-task-form';
import { TaskList } from '../task-list';
import { Footer } from '../footer';

import './app.css';

export function App() {
  const [uniqId, setUniqId] = useState(10);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [label, setLabel] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [min, setMin] = useState('');
  const [sec, setSec] = useState('');

  const taskContainerRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = (evt) => {
      const taskContainer = taskContainerRef.current;

      if (!taskContainer.contains(evt.target)) {
        const tasksWithoutEditing = data.map((task) =>
          task.status === 'editing' ? { ...task, status: 'active' } : task
        );
        setData(tasksWithoutEditing);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [data]);

  const resetTodo = (evt) => {
    setData(() =>
      data.map((item) => {
        if (evt.keyCode === 27) {
          return { ...item, status: 'active' };
        }
        return item;
      })
    );
  };

  const createItemData = (description) => {
    setUniqId(uniqId + 1);

    return {
      description,
      status: 'active',
      id: uniqId,
      createDate: new Date(),
      min,
      sec,
      timerId: null,
      isPlaying: false,
    };
  };

  const deleteItem = (id) => {
    setData(() => {
      const idx = data.findIndex((item) => item.id === id);

      return [...data.slice(0, idx), ...data.slice(idx + 1)];
    });
  };

  // eslint-disable-next-line no-shadow
  const addItem = (label, min, sec) => {
    if (label.trim()) {
      const newItem = createItemData(label, min, sec);
      setData(() => [...data, newItem]);
    }
  };

  const addItemFromForm = (evt) => {
    evt.preventDefault();
    addItem(label, min, sec);
    setLabel('');
    setMin('');
    setSec('');
  };

  const toggleStatus = (id) => {
    setData(() => {
      const idx = data.findIndex((item) => item.id === id);
      const changedObj = { ...data[idx] };

      changedObj.status = changedObj.status === 'active' ? 'completed' : 'active';

      return [...data.slice(0, idx), changedObj, ...data.slice(idx + 1)];
    });
  };

  const useFilteredTask = (evt) => {
    const RENAMEfilter = evt.target.innerText.toLowerCase();
    setFilter(RENAMEfilter);
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'active':
        return data.filter((item) => item.status === 'active');
      case 'completed':
        return data.filter((item) => item.status === 'completed');
      default:
        return data;
    }
  };

  const useClearCompleted = () => {
    setData(() => data.filter((item) => item.status !== 'completed'));
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    if (name === 'label') setLabel(value);
    else if (name === 'newLabel') setNewLabel(value);
    else if (name === 'min') setMin(value);
    else if (name === 'sec') setSec(value);
  };

  const editItem = (id) => {
    const idx = data.findIndex((item) => item.id === id);
    const changedObj = { ...data[idx] };

    if (changedObj.status === 'completed') {
      return;
    }

    setData(() => {
      changedObj.status = 'editing';
      // eslint-disable-next-line no-shadow
      const newLabel = changedObj.description;

      setNewLabel(newLabel);
      return [...data.slice(0, idx), changedObj, ...data.slice(idx + 1)];
    });
  };

  const changeItem = (evt, id) => {
    evt.preventDefault();

    setData(() => {
      const updateLabel = data.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'active',
            description: newLabel,
          };
        }
        return item;
      });

      setNewLabel('');
      return updateLabel;
    });
  };

  const stopTimer = (id) => {
    const { timerId } = data.find((el) => el.id === id);

    setData((prevData) => {
      const idx = prevData.findIndex((el) => el.id === id);
      const tasks = [...prevData];
      tasks[idx].isPlaying = false;

      return tasks;
    });
    clearInterval(timerId);
  };

  const startTimer = (id) => {
    const { isPlaying } = data.find((el) => el.id === id);

    if (!isPlaying) {
      const timerId = setInterval(() => {
        setData((prevData) => {
          const updateTodo = prevData.map((todoItem) => {
            if (todoItem.id === id) {
              let secLeft = todoItem.sec - 1;
              let minLeft = todoItem.min;
              if (minLeft > 0 && secLeft === 0) {
                minLeft -= 1;
                secLeft = 59;
              }
              if (secLeft <= 0) {
                secLeft = 0;
                stopTimer(id);
              }

              return {
                ...todoItem,
                sec: secLeft,
                min: minLeft,
              };
            }

            return todoItem;
          });

          return updateTodo;
        });
      }, 1000);
      setData((prevData) => {
        const idx = prevData.findIndex((el) => el.id === id);
        const tasks = [...prevData];
        tasks[idx].timerId = timerId;
        tasks[idx].isPlaying = true;

        return tasks;
      });
    }
  };

  const todoCount = data.filter((item) => item.status === 'active').length;
  const filteredTasks = getFilteredTasks();

  return (
    <section className="todoapp">
      <NewTaskForm
        addItemFromForm={addItemFromForm}
        handleChange={handleChange}
        label={label}
        min={min}
        sec={sec}
      />
      <section className="main" ref={taskContainerRef}>
        <TaskList
          tasks={filteredTasks}
          toggleStatus={toggleStatus}
          deleteItem={deleteItem}
          editItem={editItem}
          handleChange={handleChange}
          newLabel={newLabel}
          changeItem={changeItem}
          min={min}
          sec={sec}
          startTimer={startTimer}
          stopTimer={stopTimer}
          resetTodo={resetTodo}
        />
        <Footer
          useFilteredTask={useFilteredTask}
          currentFilter={filter}
          useClearCompleted={useClearCompleted}
          todoCount={todoCount}
        />
      </section>
    </section>
  );
}
