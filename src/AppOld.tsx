import React, {useEffect, useState} from 'react';
import './App.css';
import TodoList from './TodoList';
import {v1} from 'uuid';
import {AddItemForm} from './AddItemForm';
import {
    AppBar,
    Button,
    IconButton,
    Typography,
    Toolbar,
    Container,
    Grid,
    Paper,
    makeStyles,
    Theme, createStyles
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';

export type TasksType = {
    id: string
    title: string
    isDone: boolean
}

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TasksStateType = {
    [key: string]: TasksType[]
}


function AppOld() {


    const todoListID_1 = v1();
    const todoListID_2 = v1();
    const [todoLists, setTodoLists] = useState<TodoListType[]>([
        {id: todoListID_1, title: 'What to learn', filter: 'all'},
        {id: todoListID_2, title: 'What to buy', filter: 'all'},
    ])

    const [tasks, setTasks] = useState<TasksStateType>({
        [todoListID_1]: [
            {id: v1(), title: 'CSS', isDone: true},
            {id: v1(), title: 'HTML', isDone: true},
            {id: v1(), title: 'JS', isDone: false},
            {id: v1(), title: 'REACT', isDone: false},
            {id: v1(), title: 'Graph QL', isDone: false},
        ],
        [todoListID_2]: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'Bread', isDone: false},
            {id: v1(), title: 'Meat', isDone: false},
        ]
    })

    useEffect(() => {
        const todoListsItems = localStorage.getItem('todoLists')
        if (todoListsItems) {
            const newTodoListsItems = JSON.parse(todoListsItems)
            setTodoLists(newTodoListsItems)
        }
    }, [])
    useEffect(() => {
        localStorage.setItem('todoLists', JSON.stringify(todoLists))
    }, [todoLists])

    useEffect(() => {
        const tasksTodolist = localStorage.getItem('tasksLists')
        if (tasksTodolist) {
            const newTasksTodoLists = JSON.parse(tasksTodolist)
            setTasks(newTasksTodoLists)
        }
    }, [])
    useEffect(() => {
        localStorage.setItem('tasksLists', JSON.stringify(tasks))
    }, [tasks])

    function removeTask(taskID: string, todoListID: string) {
        // const todoListTasks = tasks[todoListID]
        // const filteredTasks = todoListTasks.filter(t => t.id !== taskID)
        // tasks[todoListID] = filteredTasks

        // tasks[todoListID] = tasks[todoListID].filter(t => t.id !== taskID)
        // setTasks({...tasks})
        const updatedTasks = tasks[todoListID].filter(t => t.id !== taskID)
        setTasks({
            ...tasks,
            [todoListID]: updatedTasks
        })
    }

    function addTask(title: string, todoListID: string) {
        const newTask: TasksType = {
            id: v1(),
            title: title,
            isDone: false
        }
        const todoListTasks = tasks[todoListID]
        // tasks[todoListID] = [newTask, ...todoListTasks]
        setTasks({
            ...tasks,
            [todoListID]: [newTask, ...todoListTasks]
        })
    }

    function changeTaskStatus(taskID: string, newIsDoneValue: boolean, todoListID: string) {
        /*const todoListTasks = tasks[todoListID]
        const task = todoListTasks.find(t => t.id === taskID)
        if (task) {
            task.isDone = newIsDoneValue
            setTasks({...tasks})
        }*/
        const updatedTasks = tasks[todoListID].map(t => t.id === taskID ? {...t, isDone: newIsDoneValue} : t)
        setTasks({
            ...tasks,
            [todoListID]: updatedTasks})
    }

    function changeTaskTitle(taskID: string, newTitle: string, todoListID: string) {
        // const todoListTasks = tasks[todoListID]
        // const task = todoListTasks.find(t => t.id === taskID)
        // if (task) {
        //     task.title = newTitle
        //     setTasks({...tasks})
        // }
        const updatedTasks = tasks[todoListID].map(t => t.id === taskID ? {...t, title: newTitle} : t)
        setTasks({
            ...tasks,
            [todoListID]: updatedTasks
        })
    }

    function changeTodoListFilter(newFilterValue: FilterValuesType, todoListID: string) {
        // const todoList = todoLists.find(tl => tl.id === todoListID)
        // if (todoList) {
        //     todoList.filter = newFilterValue
        //     setTodoLists([...todoLists])
        // }
        setTodoLists(todoLists.map(tl => tl.id === todoListID ? {...tl, filter: newFilterValue} : tl))
    }

    function changeTodoListTitle(newTitle: string, todoListID: string) {
        // const todoList = todoLists.find(tl => tl.id === todoListID)
        // if (todoList) {
        //     todoList.title = newTitle
        //     setTodoLists([...todoLists])
        // }
        setTodoLists(todoLists.map(tl => tl.id === todoListID ? {...tl, title: newTitle} : tl))
    }

    function removeTodoList(todoListID: string) {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListID))
        delete tasks[todoListID]
    }

    function addTodoList(title: string) {
        const newTodoListID = v1()
        const newTodoList: TodoListType = {id: newTodoListID, title, filter: 'all'}
        setTodoLists([newTodoList, ...todoLists])
        setTasks({...tasks, [newTodoListID]: []})
    }

    const getTasksForTodoList = (todoList: TodoListType):TasksType[] =>  {
        switch (todoList.filter) {
            case 'active':
                return tasks[todoList.id].filter(t => !t.isDone)
            case 'completed':
                return tasks[todoList.id].filter(t => t.isDone)
            default:
                return tasks[todoList.id]
        }
    }

    const todoListsComponents = todoLists.map(tl => {
        const tasks = getTasksForTodoList(tl)

        return (
            <Grid item key={tl.id}>
                <Paper elevation={6} style={{padding: '10px'}}>
                    <TodoList
                        key={tl.id}
                        todoListID={tl.id}
                        title={tl.title}
                        filter={tl.filter}
                        tasks={tasks}
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

export default AppOld;
