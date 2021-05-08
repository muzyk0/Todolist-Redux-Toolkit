import React from 'react';
import {Provider} from 'react-redux';
import {AppRootStateType} from '../../app/store';
import {combineReducers, createStore} from 'redux';
import {tasksReducer, TasksStateType} from '../../features/TodoListsList/TodoList/tasks-reducer';
import {TodoListDomainType, todoListsReducer} from '../../features/TodoListsList/TodoList/totolists-reducer';
import {v1} from 'uuid';
import {TaskStatuses, TodoTaskPriorities} from '../../api/todolist-api';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer
})

const initialGlobalState = {
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
            }
        ]
    } as TasksStateType
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}
