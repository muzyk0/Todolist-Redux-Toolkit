import { AxiosResponse } from "axios";
import { call, put, takeEvery } from "redux-saga/effects";
import { GetTasksResponse, todolistAPI } from "../../../api/todolist-api";
import { setAppStatus } from "../../../app/app-reducer";
import {
    handleServerAppError,
    handleServerNetworkError,
} from "../../../utils/error-utils";
import { ResponseType } from "../../../api/todolist-api";
import { setTasksAC, removeTaskAC } from "./tasks-reducer";

// Sagas

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    try {
        yield put(setAppStatus("loading"));
        const res: GetTasksResponse = yield call(
            todolistAPI.getTasks,
            action.todoListId
        );
        const tasks = res.items;
        yield put(setTasksAC(action.todoListId, tasks));
        yield put(setAppStatus("succeeded"));
    } catch (error) {
        handleServerNetworkError(error, put);
    }
}

export const fetchTasks = (todoListId: string) =>
    ({
        type: "TASKS/FETCH-TASKS",
        todoListId,
    } as const);

export function* deleteTaskWorkerSaga(action: ReturnType<typeof deleteTask>) {
    try {
        put(setAppStatus("loading"));
        const res: AxiosResponse<ResponseType> = yield call(
            todolistAPI.deleteTask,
            action.todoListID,
            action.taskID
        );

        if (res.data.resultCode === 0) {
            put(removeTaskAC(action.todoListID, action.taskID));
            put(setAppStatus("succeeded"));
        } else {
            handleServerAppError(res.data, put);
        }
    } catch (error) {
        handleServerNetworkError(error, put);
    }
}
export const deleteTask = (todoListID: string, taskID: string) => ({
    type: "TASKS/REMOVE-TASK",
    todoListID,
    taskID,
});

export function* tasksWatcherSaga() {
    yield takeEvery("TASKS/FETCH-TASKS", fetchTasksWorkerSaga);
    yield takeEvery("REMOVE-TASK", deleteTaskWorkerSaga);
}
