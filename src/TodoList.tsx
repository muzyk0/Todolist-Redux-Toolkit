import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {Task} from './Task';
import {TaskStatuses, TaskType} from './api/todolist-api';
import {FilterValuesType} from './state/totolists-reducer';
import {useDispatch} from 'react-redux';
import {fetchTasks} from './state/tasks-reducer';

type TodoListPropsType = {
    todoListID: string
    title: string
    filter: FilterValuesType
    tasks: Array<TaskType>
    addTask: (taskID: string, todoListID: string) => void
    removeTask: (taskID: string, todoListID: string) => void
    removeTodoList: (todoListID: string) => void
    changeTodoListFilter: (newFilterValue: FilterValuesType, todoListID: string) => void
    changeTodoListTitle: (newTitle: string, todoListID: string) => void
    changeTaskStatus: (taskID: string, status: TaskStatuses, todoListID: string) => void
    changeTaskTitle: (taskID: string, newTitle: string, todoListID: string) => void
}

export const TodoList = React.memo((props: TodoListPropsType) => {
    console.log('todolist render')
    const {
        title,
        filter,
        todoListID,
        changeTodoListFilter
    } = props

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTasks(todoListID))
    }, [])

    const addTask = useCallback((title: string) => {
        props.addTask(title, todoListID)
    }, [props.addTask, todoListID])

    const removeTodoList = () => {
        props.removeTodoList(todoListID)
    }

    const changeTodoListTitle = useCallback((title: string) => {
        props.changeTodoListTitle(title, todoListID)
    }, [props.changeTodoListTitle, todoListID])

    const setAllFilter = () => changeTodoListFilter('all', todoListID)
    const setActiveFilter = () => changeTodoListFilter('active', todoListID)
    const setCompletedFilter = () => changeTodoListFilter('completed', todoListID)

    let tasksForTodolist = props.tasks

    if (filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    // const tasks = tasksForTodolist.map(task => {
    //         const removeTask = () => props.removeTask(task.id, props.todoListID)
    //         const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) =>
    //             props.changeTaskStatus(task.id, e.currentTarget.checked, props.todoListID)
    //         const changeTaskTitle = (newTitle: string) => {
    //             props.changeTaskTitle(task.id, newTitle, props.todoListID)
    //         }
    //         return (
    //             <li style={task.isDone ? {opacity: '0.5'} : {opacity: 1}} key={task.id}>
    //                 <Checkbox
    //                     checked={task.isDone}
    //                     onChange={changeTaskStatus}
    //                 />
    //                 <EditableSpan title={task.title} changeTitle={changeTaskTitle}/>
    //                 <IconButton onClick={removeTask}>
    //                     <Delete/>
    //                 </IconButton>
    //             </li>
    //         )
    //     }
    // )

    const removeTask = useCallback((taskID: string) => {
        props.removeTask(taskID, todoListID)
    }, [props.removeTask, todoListID])

    const changeTaskStatus = useCallback((taskID: string, status: TaskStatuses) => {
        props.changeTaskStatus(taskID, status, todoListID)
    }, [props.changeTaskStatus, todoListID])

    const changeTaskTitle = useCallback((taskID: string, newTitle: string) => {
        props.changeTaskTitle(taskID, newTitle, todoListID)
    }, [props.changeTaskTitle, todoListID])

    const tasks = tasksForTodolist.map(task => {
            return <Task
                key={task.id}
                task={task}
                removeTask={removeTask}
                changeTaskStatus={changeTaskStatus}
                changeTaskTitle={changeTaskTitle}
            />
        }
    )
    return (
        <div>
            <h3>
                <EditableSpan title={title} changeTitle={changeTodoListTitle}/>
                <IconButton onClick={removeTodoList}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            <ul style={{listStyle: 'none', paddingLeft: 0}}>
                {tasks}
            </ul>
            <div>
                <Button
                    variant={filter === 'all' ? 'contained' : 'text'}
                    size={'small'}
                    onClick={setAllFilter}>All
                </Button>
                <Button
                    variant={filter === 'active' ? 'contained' : 'text'}
                    color={'secondary'}
                    size={'small'}
                    onClick={setActiveFilter}>Active
                </Button>
                <Button
                    variant={filter === 'completed' ? 'contained' : 'text'}
                    color={'primary'}
                    size={'small'}
                    onClick={setCompletedFilter}>Completed
                </Button>
            </div>
        </div>
    )
})

