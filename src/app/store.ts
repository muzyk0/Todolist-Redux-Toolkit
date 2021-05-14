import {applyMiddleware, combineReducers, createStore} from 'redux';
import {TodoListActionType, todoListsReducer} from '../features/TodoListsList/TodoList/totolists-reducer';
import {TasksActionType, tasksReducer} from '../features/TodoListsList/TodoList/tasks-reducer';
import thunk, {ThunkAction} from 'redux-thunk';

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer
})
// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppActionTypes = TasksActionType | TodoListActionType

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionTypes>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;