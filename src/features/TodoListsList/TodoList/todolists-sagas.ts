import { call, put, takeEvery } from "redux-saga/effects";
import {
    ResponseType,
    todolistAPI,
    TodoListType,
} from "../../../api/todolist-api";
import { setAppStatus } from "../../../app/app-reducer";
import {
    handleServerAppErrorSaga,
    handleServerNetworkErrorSaga,
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
        const res: Array<TodoListType> = yield call(todolistAPI.getTodos);

        yield put(setTodoListAC(res));
        yield put(setAppStatus("succeeded"));
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error);
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
        const res: ResponseType<{ item: TodoListType }> = yield call(
            todolistAPI.createTodo,
            action.title
        );
        if (res.resultCode === 0) {
            yield put(addTodolistAC(res.data.item));
            yield put(setAppStatus("succeeded"));
        } else {
            yield* handleServerAppErrorSaga(res);
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error);
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
        const res: ResponseType = yield call(
            todolistAPI.deleteTodo,
            action.todoListId
        );
        if (res.resultCode === 0) {
            yield put(removeTodoListAC(action.todoListId));
            yield put(setAppStatus("succeeded"));
        } else {
            yield* handleServerAppErrorSaga(res);
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error);
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
        const res: ResponseType = yield call(
            todolistAPI.updateTodoTitle,
            action.todolistId,
            action.title
        );
        if (res.resultCode === 0) {
            yield put(changeTodoListTitleAC(action.todolistId, action.title));
            yield put(setAppStatus("succeeded"));
        } else {
            yield* handleServerAppErrorSaga(res);
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error);
    }
}

export function* todoListsWatcherSaga() {
    yield takeEvery("TODOLISTS/FETCH-TODOLIST", fetchTodoListsWorkerSaga);
    yield takeEvery("TODOLISTS/CREATE-TODOLIST", createTodoListWorkerSaga);
    yield takeEvery("TODOLISTS/DELETE-TODOLIST", deleteTodoListWorkerSaga);
    yield takeEvery(
        "TODOLISTS/UPDATE-TODOLIST-TITLE",
        updateTodoListTitleWorkerSaga
    );
}
