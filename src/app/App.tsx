import React, {useCallback, useEffect} from 'react'
import './App.css'
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    createStyles,
    IconButton,
    LinearProgress,
    makeStyles,
    Theme,
    Toolbar,
    Typography
} from '@material-ui/core'
import {Menu} from '@material-ui/icons'
import {TodolistsList} from '../features/TodolistsList'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {useSelector} from 'react-redux'
import {appActions} from '../features/Application'
import {Route, Switch} from 'react-router-dom'
import {authActions, authSelectors, Login} from '../features/Auth'
import {selectIsInitialized, selectStatus} from '../features/Application/selectors'
import {useActions} from '../utils/redux-utils'

type PropsType = {}

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

const App: React.FC<PropsType> = () => {
    const classes = useStyles();
    const status = useSelector(selectStatus)
    const isInitialized = useSelector(selectIsInitialized)
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn)

    const {logout} = useActions(authActions)
    const {initializeApp} = useActions(appActions)

    useEffect(() => {
        if (!isInitialized) {
            initializeApp()
        }
    }, [isInitialized, initializeApp])

    const logoutHandler = useCallback(() => {
        logout()
    }, [logout])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        TodoList
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container maxWidth={'xl'}>
                <Switch>
                    <Route exact path={'/'} render={() => <TodolistsList demo={false}/>}/>
                    <Route exact path={'/login'} render={() => <Login/>}/>

                    <Route exact path={'/404'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
                    {/*<Redirect from={'*'} to={'/404'}/>*/}
                </Switch>
            </Container>
        </div>
    )
}

export default App
