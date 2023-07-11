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
  };

  createItemData = (description) => {
    this.uniqId += 1;

    return {
      description,
      status: 'active',
      id: this.uniqId,
      createDate: new Date(),
    };
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

  deleteItem = (id) => {
    this.setState(({ data }) => {
      const idx = data.findIndex((item) => item.id === id);

      return {
        data: [...data.slice(0, idx), ...data.slice(idx + 1)],
      };
    });
  };

  addItem = (label) => {
    if (label.trim()) {
      const newItem = this.createItemData(label);

      this.setState(({ data }) => ({
        data: [...data, newItem],
      }));
    }
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

  addItemFromForm = (evt) => {
    evt.preventDefault();
    this.addItem(this.state.label);
    this.setState({ label: '' });
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
    setTimeout(() => {});
    window.addEventListener('click', this.handleClick);
    window.addEventListener('keydown', this.handleKeydown);

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

  render() {
    const { filter } = this.state;
    const todoCount = this.state.data.filter((item) => item.status === 'active').length;
    const filteredTasks = this.getFilteredTasks();

    return (
      <section className="todoapp">
        <NewTaskForm addItemFromForm={this.addItemFromForm} handleChange={this.handleChange} label={this.state.label} />
        <section className="main">
          <TaskList
            tasks={filteredTasks}
            toggleStatus={this.toggleStatus}
            deleteItem={this.deleteItem}
            editItem={this.editItem}
            handleChange={this.handleChange}
            newLabel={this.state.newLabel}
            changeItem={this.changeItem}
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
