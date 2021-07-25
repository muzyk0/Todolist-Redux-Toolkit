import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import thunk, { ThunkAction } from "redux-thunk";
import { authWatcherSaga } from "../features/Login/auth-sagas";
import {
    authReducer,
    AuthReducerActionType,
} from "../features/Login/authReducer";
import {
    TasksActionType,
    tasksReducer,
} from "../features/TodoListsList/TodoList/tasks-reducer";
import { tasksWatcherSaga } from "../features/TodoListsList/TodoList/tasks-sagas";
import { todoListsWatcherSaga } from "../features/TodoListsList/TodoList/todolists-sagas";
import {
    TodoListActionType,
    todoListsReducer,
} from "../features/TodoListsList/TodoList/totolists-reducer";
import { appActionActionsType, appReducer } from "./app-reducer";
import { appWatcherSaga } from "./app-sagas";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer,
});

const sagaMiddleware = createSagaMiddleware();

// непосредственно создаём store
export const store = createStore(
    rootReducer,
    applyMiddleware(thunk, sagaMiddleware)
);

sagaMiddleware.run(rootWatcher);

function* rootWatcher() {
    yield all([
        authWatcherSaga(),
        appWatcherSaga(),
        tasksWatcherSaga(),
        todoListsWatcherSaga(),
    ]);
}

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>;

export type AppActionTypes =
    | TasksActionType
    | TodoListActionType
    | appActionActionsType
    | AuthReducerActionType;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppRootStateType,
    unknown,
    AppActionTypes
>;
