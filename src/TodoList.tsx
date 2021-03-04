import React, {useState, KeyboardEvent, ChangeEvent} from 'react';
import {FilterValuesType, TasksType} from './App';

type TodoListPropsType = {
    todoListId: string
    title: string
    filter: FilterValuesType
    tasks: Array<TasksType>
    addTask: (taskID: string, todoListID: string) => void
    removeTask: (taskID: string, todoListID: string) => void
    removeTodoList: (todoListID: string) => void
    changeForTodoList: (newFilterValue: FilterValuesType, todoListID: string) => void
    changeTaskStatus: (taskID: string, newIsDoneValue: boolean, todoListID: string) => void
}

function TodoList(props: TodoListPropsType) {

    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const AddTask = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.addTask(trimmedTitle, props.todoListId)
        } else {
            setError('Title is required!')
        }
        setTitle('')
    }

    const onKeyPressAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            AddTask()
        }
    }
// ChangeEvent<HTMLInputElement>
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(null)
    }
    const removeTodoList = () => {
        props.removeTodoList(props.todoListId)
    }
    const setAllFilter = () => props.changeForTodoList('all', props.todoListId)
    const setActiveFilter = () => props.changeForTodoList('active', props.todoListId)
    const setCompletedFilter = () => props.changeForTodoList('completed', props.todoListId)


    const tasks = props.tasks.map(task => {
            const removeTask = () => props.removeTask(task.id, props.todoListId)
            const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) =>
                props.changeTaskStatus(task.id, e.currentTarget.checked, props.todoListId)

            return (
                <li className={task.isDone ? 'isDone' : ''}>
                    <input
                        type="checkbox"
                        checked={task.isDone}
                        onChange={changeTaskStatus}
                    />
                    <span>{task.title}</span>
                    <button onClick={removeTask}>X</button>
                </li>
            )
        }
    )
    return (
        <div className={'task'}>
            <h3>{props.title}
                <button onClick={removeTodoList}>X</button>
            </h3>

            <div>
                <input
                    className={error ? 'error' : ''}
                    value={title}
                    onChange={changeTitle}
                    onKeyPress={onKeyPressAddTask}
                />

                <button onClick={AddTask}>Add</button>
                {error && <div className={'errorMessage'}>{error}</div>}
            </div>
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