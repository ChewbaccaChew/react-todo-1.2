// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';

import { NewTaskForm } from '../new-task-form';
import { TaskList } from '../task-list';
import { Footer } from '../footer';

import './app.css';

export class App extends Component {
  uniqId = 10;

  state = {
    data: [],
    filter: 'all',
    label: '',
    newLabel: '',
    min: '',
    sec: '',
  };

  createItemData = (description, min, sec) => {
    this.uniqId += 1;

    return {
      description,
      status: 'active',
      id: this.uniqId,
      createDate: new Date(),
      min,
      sec,
      timerId: null,
      isPlaying: false,
    };
  };

  deleteItem = (id) => {
    this.setState(({ data }) => {
      const idx = data.findIndex((item) => item.id === id);

      return {
        data: [...data.slice(0, idx), ...data.slice(idx + 1)],
      };
    });
  };

  addItem = (label, min, sec) => {
    if (label.trim()) {
      const newItem = this.createItemData(label, min, sec);

      this.setState(({ data }) => ({
        data: [...data, newItem],
      }));
    }
  };

  addItemFromForm = (evt) => {
    evt.preventDefault();
    this.addItem(this.state.label, this.state.min, this.state.sec);
    this.setState({ label: '', min: '', sec: '' });
  };

  toggleStatus = (id) => {
    this.setState(({ data }) => {
      const idx = data.findIndex((item) => item.id === id);
      const changedObj = { ...data[idx] };

      changedObj.status = changedObj.status === 'active' ? 'completed' : 'active';

      return {
        data: [...data.slice(0, idx), changedObj, ...data.slice(idx + 1)],
      };
    });
  };

  useFilteredTask = (evt) => {
    const filter = evt.target.innerText.toLowerCase();
    this.setState({ filter });
  };

  getFilteredTasks = () => {
    const { data, filter } = this.state;

    switch (filter) {
      case 'active':
        return data.filter((item) => item.status === 'active');
      case 'completed':
        return data.filter((item) => item.status === 'completed');
      default:
        return data;
    }
  };

  useClearCompleted = () => {
    this.setState(({ data }) => ({ data: data.filter((item) => item.status !== 'completed') }));
  };

  handleChange = (evt) => {
    const { name, value } = evt.target;
    this.setState({ [name]: value });
  };

  handleClick = (evt) => {
    if (!evt.target.value) {
      this.resetEditing();
    }
  };

  handleKeydown = (evt) => {
    if (evt.key === 'Escape') {
      this.resetEditing();
    }
  };

  editItem = (id) => {
    // без таймаута не работает
    setTimeout(() => {
      window.addEventListener('click', this.handleClick);
      window.addEventListener('keydown', this.handleKeydown);
    });

    const idx = this.state.data.findIndex((item) => item.id === id);
    const changedObj = { ...this.state.data[idx] };

    if (changedObj.status === 'completed') {
      return;
    }

    this.resetEditing();

    this.setState(({ data }) => {
      changedObj.status = 'editing';
      const newLabel = changedObj.description;

      return {
        data: [...data.slice(0, idx), changedObj, ...data.slice(idx + 1)],
        newLabel,
      };
    });
  };

  changeItem = (evt, id) => {
    evt.preventDefault();

    this.setState(({ data }) => {
      const updateLabel = data.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'active',
            description: this.state.newLabel,
          };
        }
        return item;
      });

      return {
        data: updateLabel,
        newLabel: '',
      };
    });
  };

  resetEditing = () => {
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('click', this.handleClick);

    this.setState(({ data }) => {
      const updateLabel = data.map((item) => {
        if (item.status === 'editing') {
          return {
            ...item,
            status: 'active',
          };
        }

        return item;
      });

      return {
        data: updateLabel,
      };
    });
  };

  stopTimer = (id) => {
    const { timerId } = this.state.data.find((el) => el.id === id);

    this.setState(({ data }) => {
      const idx = data.findIndex((el) => el.id === id);
      const tasks = [...data];
      tasks[idx].isPlaying = false;

      return {
        data: tasks,
      };
    });
    clearInterval(timerId);
  };

  startTimer = (id) => {
    const { isPlaying } = this.state.data.find((el) => el.id === id);

    if (!isPlaying) {
      const timerId = setInterval(() => {
        this.setState((prevState) => {
          const updateTodo = prevState.data.map((todoItem) => {
            if (todoItem.id === id) {
              let secLeft = todoItem.sec - 1;
              let minLeft = todoItem.min;
              if (minLeft > 0 && secLeft === 0) {
                minLeft -= 1;
                secLeft = 59;
              }
              if (secLeft === 0 || secLeft < 0) {
                secLeft = 0;
                this.stopTimer(id);
              }

              return {
                ...todoItem,
                sec: secLeft,
                min: minLeft,
              };
            }

            return todoItem;
          });

          return {
            data: updateTodo,
          };
        });
      }, 1000);
      this.setState(({ data }) => {
        const idx = data.findIndex((el) => el.id === id);
        const tasks = [...data];
        tasks[idx].timerId = timerId;
        tasks[idx].isPlaying = true;

        return {
          data: tasks,
        };
      });
    }
  };

  render() {
    const { data, filter, label, newLabel, min, sec } = this.state;
    const todoCount = data.filter((item) => item.status === 'active').length;
    const filteredTasks = this.getFilteredTasks();

    return (
      <section className="todoapp">
        <NewTaskForm
          addItemFromForm={this.addItemFromForm}
          handleChange={this.handleChange}
          label={label}
          min={min}
          sec={sec}
        />
        <section className="main">
          <TaskList
            tasks={filteredTasks}
            toggleStatus={this.toggleStatus}
            deleteItem={this.deleteItem}
            editItem={this.editItem}
            handleChange={this.handleChange}
            newLabel={newLabel}
            changeItem={this.changeItem}
            min={min}
            sec={sec}
            startTimer={this.startTimer}
            stopTimer={this.stopTimer}
          />
          <Footer
            useFilteredTask={this.useFilteredTask}
            currentFilter={filter}
            useClearCompleted={this.useClearCompleted}
            todoCount={todoCount}
          />
        </section>
      </section>
    );
  }
}
