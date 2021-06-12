import React from 'react';
import {Provider} from 'react-redux';
import {AppRootStateType, RootReducerType} from '../../app/store';
import {combineReducers} from 'redux';
import {tasksReducer, TasksStateType} from '../../features/TodoListsList/TodoList/tasks-reducer';
import {TodoListDomainType, todoListsReducer} from '../../features/TodoListsList/TodoList/totolists-reducer';
import {v1} from 'uuid';
import {TaskStatuses, TodoTaskPriorities} from '../../api/todolist-api';
import {appReducer} from '../../app/app-reducer';
import {authReducer} from '../../features/Login/authReducer';
import thunk from 'redux-thunk';
import {HashRouter} from 'react-router-dom';
import {configureStore} from '@reduxjs/toolkit';

const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer,
})

const initialGlobalState: AppRootStateType = {
    todoLists: [
        {
            id: 'todolistId1', title: 'What to learn', addedDate: '',
            order: 0
        },
        {
            id: 'todolistId2', title: 'What to buy', addedDate: '',
            order: 0
        }
    ] as TodoListDomainType[],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(),
                title: 'HTML&CSS',
                status: TaskStatuses.Completed,
                description: '',
                todoListId: 'todolistId2',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            },
            {
                id: v1(),
                title: 'JS',
                status: TaskStatuses.Completed,
                description: '',
                todoListId: 'todolistId2',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            },
        ],

        ['todolistId2']: [
            {
                id: v1(),
                title: 'Milk',
                status: TaskStatuses.Completed,
                description: '',
                todoListId: 'todolistId2',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            },
            {
                id: v1(),
                title: 'React Book',
                status: TaskStatuses.Completed,
                description: '',
                todoListId: 'todolistId2',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            }
        ]
    } as TasksStateType,
    app: {
        error: null,
        status: 'idle',
        isInitialized: true
    },
    auth: {
        isLoggedIn: true
    }
};

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>
        {storyFn()}
    </Provider>
}

export const BrowserRouterDecorator = (storyFn: any) => {
    return <HashRouter>
        {storyFn()}
    </HashRouter>

}
