import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../../app/store';
import {
    changeTodoListFilterAC,
    createTodoList,
    deleteTodoList,
    fetchTodoLists,
    FilterValuesType,
    TodoListDomainType,
    updateTodoListTitle
} from './TodoList/totolists-reducer';
import {createTask, deleteTask, TasksStateType, updateTask} from './TodoList/tasks-reducer';
import {TaskStatuses} from '../../api/todolist-api';
import {Grid, Paper} from '@material-ui/core';
import {TodoList} from './TodoList/TodoList';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm';
import {Redirect} from 'react-router-dom';

type TodoListsListPropsType = {}
export const TodoListsList: React.FC<TodoListsListPropsType> = () => {

    const todoLists = useSelector<AppRootStateType, TodoListDomainType[]>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        dispatch(fetchTodoLists())
    }, [])

    const removeTask = useCallback((todoListID: string, taskID: string) => {
        dispatch(deleteTask(todoListID, taskID))

    }, [dispatch])
    const addTask = useCallback((todoListID: string, title: string) => {
        dispatch(createTask(todoListID, title))
    }, [dispatch])
    const changeTaskStatus = useCallback((todoListID: string, taskID: string, status: TaskStatuses) => {
        dispatch(updateTask(todoListID, taskID, {status}))

    }, [dispatch])
    const changeTaskTitle = useCallback((todoListID: string, taskID: string, newTitle: string) => {
        dispatch(updateTask(todoListID, taskID, {title: newTitle}))

    }, [dispatch])
    const changeTodoListFilter = useCallback((todoListID: string, newFilterValue: FilterValuesType) => {
        dispatch(changeTodoListFilterAC({id: todoListID, filter: newFilterValue}))

    }, [dispatch])
    const addTodoList = useCallback((title: string) => {
        dispatch(createTodoList(title))
    }, [dispatch])
    const removeTodoList = useCallback((todoListID: string) => {
        dispatch(deleteTodoList(todoListID))

    }, [dispatch])
    const changeTodoListTitle = useCallback((todoListID: string, newTitle: string) => {
        dispatch(updateTodoListTitle(todoListID, newTitle))

    }, [dispatch])

    if (!isLoggedIn) {
        return <Redirect to={'/login'}/>
    }

    const todoListsComponents = todoLists.map(tl => {
        return (
            <Grid item key={tl.id}>
                <Paper elevation={6} style={{padding: '10px'}}>
                    <TodoList
                        key={tl.id}
                        todoListID={tl.id}
                        title={tl.title}
                        filter={tl.filter}
                        entityStatus={tl.entityStatus}
                        tasks={tasks[tl.id]}
                        addTask={addTask}
                        removeTask={removeTask}
                        removeTodoList={removeTodoList}
                        changeTaskStatus={changeTaskStatus}
                        changeTodoListFilter={changeTodoListFilter}
                        changeTodoListTitle={changeTodoListTitle}
                        changeTaskTitle={changeTaskTitle}
                    />
                </Paper>
            </Grid>
        )
    })

    return (
        <>
            <Grid container style={{padding: '20px 0'}}>
                <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid container spacing={3}>
                {todoListsComponents}
            </Grid>
        </>
    )
}