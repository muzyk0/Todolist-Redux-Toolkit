import { AxiosResponse } from "axios";
import { call, put, takeEvery } from "redux-saga/effects";
import {
    ResponseType,
    todolistAPI,
    TodoListType,
} from "../../../api/todolist-api";
import { setAppStatus } from "../../../app/app-reducer";
import {
    handleServerAppError,
    handleServerNetworkError,
} from "../../../utils/error-utils";
import {
    addTodolistAC,
    changeTodolistEntityStatusAC,
    changeTodoListTitleAC,
    removeTodoListAC,
    setTodoListAC,
} from "./totolists-reducer";

export const fetchTodoLists = () => ({
    type: "TODOLISTS/FETCH-TODOLIST",
});

export function* fetchTodoListsWorkerSaga(
    action: ReturnType<typeof fetchTodoLists>
) {
    try {
        yield put(setAppStatus("loading"));
        const res: AxiosResponse<Array<TodoListType>> = yield call(
            todolistAPI.getTodos
        );

        yield put(setTodoListAC(res.data));
        yield put(setAppStatus("succeeded"));
    } catch (error) {
        handleServerNetworkError(error, put);
    }
}

export const createTodoList = (title: string) => ({
    type: "TODOLISTS/CREATE-TODOLIST",
    title,
});

export function* createTodoListWorkerSaga(
    action: ReturnType<typeof createTodoList>
) {
    try {
        yield put(setAppStatus("loading"));
        const res: AxiosResponse<
            ResponseType<{ item: TodoListType }>
        > = yield call(todolistAPI.createTodo, action.title);
        if (res.data.resultCode === 0) {
            yield put(addTodolistAC(res.data.data.item));
            yield put(setAppStatus("succeeded"));
        } else {
            handleServerAppError(res.data, put);
        }
    } catch (error) {
        handleServerNetworkError(error, put);
    }
}

export const deleteTodoList = (todoListId: string) => ({
    type: "TODOLISTS/DELETE-TODOLIST",
    todoListId,
});

export function* deleteTodoListWorkerSaga(
    action: ReturnType<typeof deleteTodoList>
) {
    try {
        yield put(setAppStatus("loading"));
        yield put(changeTodolistEntityStatusAC(action.todoListId, "loading"));
        const res: AxiosResponse<ResponseType> = yield call(
            todolistAPI.deleteTodo,
            action.todoListId
        );
        if (res.data.resultCode === 0) {
            yield put(removeTodoListAC(action.todoListId));
            yield put(setAppStatus("succeeded"));
        } else {
            handleServerAppError(res.data, put);
        }
    } catch (error) {
        handleServerNetworkError(error, put);
    }
}

export const updateTodoListTitle = (todolistId: string, title: string) => ({
    type: "TODOLISTS/UPDATE-TODOLIST-TITLE",
    todolistId,
    title,
});

export function* updateTodoListTitleWorkerSaga(
    action: ReturnType<typeof updateTodoListTitle>
) {
    try {
        yield put(setAppStatus("loading"));
        const res: AxiosResponse<ResponseType> = yield call(
            todolistAPI.updateTodoTitle,
            action.todolistId,
            action.title
        );
        if (res.data.resultCode === 0) {
            yield put(changeTodoListTitleAC(action.todolistId, action.title));
            yield put(setAppStatus("succeeded"));
        } else {
            handleServerAppError(res.data, put);
        }
    } catch (error) {
        handleServerNetworkError(error, put);
    }
}

export function* todoListsWatcherSaga() {
    yield takeEvery("TODOLISTS/FETCH-TODOLIST", fetchTodoListsWorkerSaga);
    yield takeEvery("TODOLISTS/CREATE-TODOLIST", createTodoListWorkerSaga);
    yield takeEvery("TODOLISTS/DELETE-TODOLIST", deleteTodoListWorkerSaga);
    yield takeEvery("TODOLISTS/DELETE-TODOLIST", updateTodoListTitleWorkerSaga);
}
