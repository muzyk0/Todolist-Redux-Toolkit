import React, {useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button, CircularProgress,
    Container,
    createStyles,
    IconButton, LinearProgress,
    makeStyles,
    Theme,
    Toolbar,
    Typography
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {TodoListsList} from '../features/TodoListsList/TodoListsList';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './store';
import {InitializeApp, RequestStatusType} from './app-reducer';
import {ErrorSnackbar} from '../components/ErrorSnackbar';
import {Route, Switch, Redirect} from 'react-router-dom'
import {Login} from '../features/Login/Login';
import {LogoutTC} from '../features/Login/authReducer';

interface Props {
    demo?: boolean
}

export const App: React.FC<Props> = ({demo = false}) => {
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

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!demo) {
            dispatch(InitializeApp())
        }
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    const logoutHandle = () => {
        dispatch(LogoutTC())
    }

    return (
        <div className={classes.root}>
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        TodoList
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandle}>Logout</Button>}
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="secondary"/>}
            <Container fixed>
                <Switch>
                    <Route exact path={'/'} render={() => <TodoListsList demo={demo}/>}/>
                    <Route exact path={'/login'} render={() => <Login/>}/>

                    <Route exact path={'/404'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
                    <Redirect from={'*'} to={'/404'}/>
                </Switch>
            </Container>
        </div>
    )
}

export default App;
