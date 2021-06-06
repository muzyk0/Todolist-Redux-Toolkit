import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../components/EdditableSpan/EditableSpan';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {Task} from './Task/Task';
import {TaskStatuses} from '../../../api/todolist-api';
import {FilterValuesType} from './totolists-reducer';
import {fetchTasks, TaskDomainType} from './tasks-reducer';
import {RequestStatusType} from '../../../app/app-reducer';
import {useDispatch} from 'react-redux';

type TodoListPropsType = {
    todoListID: string
    title: string
    filter: FilterValuesType
    entityStatus: RequestStatusType
    tasks: Array<TaskDomainType>
    addTask: (todoListID: string, taskID: string) => void
    removeTask: (todoListID: string, taskID: string) => void
    removeTodoList: (todoListID: string) => void
    changeTodoListFilter: (todoListID: string, newFilterValue: FilterValuesType) => void
    changeTodoListTitle: (todoListID: string, newTitle: string) => void
    changeTaskStatus: (todoListID: string, taskID: string, status: TaskStatuses) => void
    changeTaskTitle: (todoListID: string, taskID: string, newTitle: string) => void
}

export const TodoList = React.memo((props: TodoListPropsType) => {
    const {
        title,
        filter,
        todoListID,
        changeTodoListFilter
    } = props

    const dispatch = useDispatch()
    useEffect(() => {

        const thunk = fetchTasks(todoListID)
        dispatch(thunk)
    }, [])

    const addTask = useCallback((title: string) => {
        props.addTask(todoListID, title)
    }, [props.addTask, todoListID])

    const removeTodoList = () => {
        props.removeTodoList(todoListID)
    }

    const changeTodoListTitle = useCallback((title: string) => {
        props.changeTodoListTitle(todoListID, title)
    }, [props.changeTodoListTitle, todoListID])

    const setAllFilter = () => changeTodoListFilter(todoListID, 'all')
    const setActiveFilter = () => changeTodoListFilter(todoListID, 'active')
    const setCompletedFilter = () => changeTodoListFilter(todoListID, 'completed')

    // let tasksForTodolist = props.tasks
    //
    // if (filter === 'active') {
    //     tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    // }
    // if (filter === 'completed') {
    //     tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    // }

    const getTasksForTodoList = (tasks: TaskDomainType[]) => {
        switch (filter) {
            case 'active':
                return props.tasks.filter(t => t.status === TaskStatuses.New)
            case 'completed':
                return props.tasks.filter(t => t.status === TaskStatuses.Completed)
            default:
                return tasks
        }
    }

    const removeTask = useCallback((taskID: string) => {
        props.removeTask(todoListID, taskID)
    }, [todoListID, props.removeTask])

    const changeTaskStatus = useCallback((taskID: string, status: TaskStatuses) => {
        props.changeTaskStatus(todoListID, taskID, status)
    }, [props.changeTaskStatus, todoListID])

    const changeTaskTitle = useCallback((taskID: string, newTitle: string) => {
        props.changeTaskTitle(todoListID, taskID, newTitle)
    }, [props.changeTaskTitle, todoListID])

    const tasks = getTasksForTodoList(props.tasks).map(task => {
            return <Task
                key={task.id}
                task={task}
                removeTask={removeTask}
                changeTaskStatus={changeTaskStatus}
                changeTaskTitle={changeTaskTitle}
                disabled={task.entityStatus === 'loading'}
            />
        }
    )
    return (
        <div>
            <h3>
                <EditableSpan title={title} changeTitle={changeTodoListTitle} disabled={props.entityStatus === 'loading'}/>
                <IconButton onClick={removeTodoList} disabled={props.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={props.entityStatus === 'loading'}/>
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

