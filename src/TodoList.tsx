import React, {useState, KeyboardEvent, ChangeEvent} from 'react';
import {FilterValuesType, TasksType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';

type TodoListPropsType = {
    todoListID: string
    title: string
    filter: FilterValuesType
    tasks: Array<TasksType>
    addTask: (taskID: string, todoListID: string) => void
    removeTask: (taskID: string, todoListID: string) => void
    removeTodoList: (todoListID: string) => void
    changeTodoListFilter: (newFilterValue: FilterValuesType, todoListID: string) => void
    changeTodoListTitle: (newTitle: string, todoListID: string) => void
    changeTaskStatus: (taskID: string, newIsDoneValue: boolean, todoListID: string) => void
    changeTaskTitle: (taskID: string, newTitle: string, todoListID: string) => void
}

function TodoList(props: TodoListPropsType) {

    const addTask = (title: string) => props.addTask(title, props.todoListID)

    const removeTodoList = () => {
        props.removeTodoList(props.todoListID)
    }
    const setAllFilter = () => props.changeTodoListFilter('all', props.todoListID)
    const setActiveFilter = () => props.changeTodoListFilter('active', props.todoListID)
    const setCompletedFilter = () => props.changeTodoListFilter('completed', props.todoListID)
    const changeTodoListTitle = (title: string) => props.changeTodoListTitle(title, props.todoListID)


    const tasks = props.tasks.map(task => {
            const removeTask = () => props.removeTask(task.id, props.todoListID)
            const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) =>
                props.changeTaskStatus(task.id, e.currentTarget.checked, props.todoListID)
            const changeTaskTitle = (newTitle: string) => {
                props.changeTaskTitle(task.id, newTitle, props.todoListID)
            }
            return (
                <li className={task.isDone ? 'isDone' : ''}>
                    <input
                        type="checkbox"
                        checked={task.isDone}
                        onChange={changeTaskStatus}
                    />
                    <EditableSpan title={task.title} changeTitle={changeTaskTitle}/>
                    <button onClick={removeTask}>X</button>
                </li>
            )
        }
    )
    return (
        <div className={'task'}>
            <h3>
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                <button onClick={removeTodoList}>X</button>
            </h3>
            <AddItemForm addItem={addTask}/>
            <ul>
                {tasks}
            </ul>
            <div>
                <button className={props.filter === 'all' ? 'selected' : ''}
                        onClick={setAllFilter}>All
                </button>
                <button className={props.filter === 'active' ? 'selected' : ''}
                        onClick={setActiveFilter}>Active
                </button>
                <button className={props.filter === 'completed' ? 'selected' : ''}
                        onClick={setCompletedFilter}>Completed
                </button>
            </div>
        </div>
    )
}

export default TodoList