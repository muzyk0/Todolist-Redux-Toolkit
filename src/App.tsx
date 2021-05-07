import React, {useCallback, useEffect} from 'react';
import './App.css';
import {TodoList} from './TodoList';
import {AddItemForm} from './AddItemForm';
import {
    AppBar,
    Button,
    Container,
    createStyles,
    Grid,
    IconButton,
    makeStyles,
    Paper,
    Theme,
    Toolbar,
    Typography
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    addTodolistAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    fetchTodoLists,
    FilterValuesType,
    removeTodoListAC,
    TodoListDomainType
} from './state/totolists-reducer';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from './state/tasks-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {TaskStatuses, TaskType} from './api/todolist-api';

export type TasksStateType = {
    [key: string]: TaskType[]
}

export function App() {
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                flexGrow: 1,
            },
            menuButton: {
                marginRight: theme.spacing(2),
            },
            title: {
                flexGrow: 1,
            },
        }),
    );
    const classes = useStyles();

    const todoLists = useSelector<AppRootStateType, TodoListDomainType[]>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTodoLists())
    }, [])

    const removeTask = useCallback((taskID: string, todoListID: string) => {
        dispatch(removeTaskAC(taskID, todoListID))

    }, [dispatch])
    const addTask = useCallback((title: string, todoListID: string) => {
        dispatch(addTaskAC(title, todoListID))
    }, [dispatch])
    const changeTaskStatus = useCallback((taskID: string, status: TaskStatuses, todoListID: string) => {
        dispatch(changeTaskStatusAC(taskID, status, todoListID))

    }, [dispatch])
    const changeTaskTitle = useCallback((taskID: string, newTitle: string, todoListID: string) => {
        dispatch(changeTaskTitleAC(taskID, newTitle, todoListID))

    }, [dispatch])
    const changeTodoListFilter = useCallback((newFilterValue: FilterValuesType, todoListID: string) => {
        dispatch(changeTodoListFilterAC(todoListID, newFilterValue))

    }, [dispatch])
    const changeTodoListTitle = useCallback((newTitle: string, todoListID: string) => {
        dispatch(changeTodoListTitleAC(todoListID, newTitle))

    }, [dispatch])
    const removeTodoList = useCallback((todoListID: string) => {
        const action = removeTodoListAC(todoListID)
        dispatch(action)

    }, [dispatch])
    const addTodoList = useCallback((title: string) => {
        const action = addTodolistAC(title)
        dispatch(action)
    }, [dispatch])

    // const getTasksForTodoList = (todoList: TodoListType): TasksType[] => {
    //     switch (todoList.filter) {
    //         case 'active':
    //             return tasks[todoList.id].filter(t => !t.isDone)
    //         case 'completed':
    //             return tasks[todoList.id].filter(t => t.isDone)
    //         default:
    //             return tasks[todoList.id]
    //     }
    // }

    const todoListsComponents = todoLists.map(tl => {


        return (
            <Grid item key={tl.id}>
                <Paper elevation={6} style={{padding: '10px'}}>
                    <TodoList
                        key={tl.id}
                        todoListID={tl.id}
                        title={tl.title}
                        filter={tl.filter}
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
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        TodoList
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px 0'}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {todoListsComponents}
                </Grid>
            </Container>
        </div>
    )
}

export default App;
