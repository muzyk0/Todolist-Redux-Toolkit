import { AxiosResponse } from "axios";
import { call, put, select, takeEvery } from "redux-saga/effects";
import {
    GetTasksResponse,
    ResponseType,
    TaskType,
    todolistAPI,
    UpdateTaskModelType,
} from "../../../api/todolist-api";
import { setAppStatus } from "../../../app/app-reducer";
import { AppRootStateType } from "../../../app/store";
import {
    handleServerAppError,
    handleServerNetworkError,
} from "../../../utils/error-utils";
import {
    addTaskAC,
    changeTaskEntityStatusAC,
    removeTaskAC,
    setTasksAC,
    UpdateDomainTaskModelType,
    updateTaskAC,
} from "./tasks-reducer";

// Sagas
export const fetchTasks = (todoListId: string) =>
    ({
        type: "TASKS/FETCH-TASKS",
        todoListId,
    } as const);

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    try {
        yield put(setAppStatus("loading"));
        const res: AxiosResponse<GetTasksResponse> = yield call(
            todolistAPI.getTasks,
            action.todoListId
        );
        const tasks = res.data.items;
        yield put(setTasksAC(action.todoListId, tasks));
        yield put(setAppStatus("succeeded"));
    } catch (error) {
        handleServerNetworkError(error, put);
    }
}

export const deleteTask = (todoListID: string, taskID: string) => ({
    type: "TASKS/REMOVE-TASK",
    todoListID,
    taskID,
});

export function* deleteTaskWorkerSaga(action: ReturnType<typeof deleteTask>) {
    try {
        yield put(setAppStatus("loading"));
        const res: AxiosResponse<ResponseType> = yield call(
            todolistAPI.deleteTask,
            action.todoListID,
            action.taskID
        );

        if (res.data.resultCode === 0) {
            yield put(removeTaskAC(action.todoListID, action.taskID));
            yield put(setAppStatus("succeeded"));
        } else {
            yield handleServerAppError(res.data, put);
        }
    } catch (error) {
        yield handleServerNetworkError(error, put);
    }
}

export const createTask = (todoListID: string, title: string) => ({
    type: "TASKS/CREATE-TASK",
    todoListID,
    title,
});

export function* createTaskWorkerSaga(action: ReturnType<typeof createTask>) {
    try {
        yield put(setAppStatus("loading"));
        const res: AxiosResponse<ResponseType<{ item: TaskType }>> = yield call(
            todolistAPI.createTask,
            action.todoListID,
            action.title
        );
        if (res.data.resultCode === 0) {
            yield put(addTaskAC(res.data.data.item));
            yield put(setAppStatus("succeeded"));
        } else {
            yield handleServerAppError(res.data, put);
        }
    } catch (error) {
        yield handleServerNetworkError(error, put);
    }
}

export const updateTask = (
    todoListID: string,
    taskID: string,
    model: UpdateDomainTaskModelType
) => ({
    type: "TASKS/UPDATA-TASK",
    todoListID,
    taskID,
    model,
});

export function* updateTaskWorkerSaga(action: ReturnType<typeof updateTask>) {
    const state: AppRootStateType = yield select();
    const currentTask = state.tasks[action.todoListID].find(
        (t) => t.id === action.taskID
    );
    if (!currentTask) {
        console.warn("Task not found in the state");
        return;
    }

    const apiModel: UpdateTaskModelType = {
        title: currentTask.title,
        status: currentTask.status,
        deadline: currentTask.deadline,
        description: currentTask.description,
        priority: currentTask.priority,
        startDate: currentTask.startDate,
        ...action.model,
    };

    try {
        yield put(setAppStatus("loading"));
        yield put(
            changeTaskEntityStatusAC(
                action.todoListID,
                action.taskID,
                "loading"
            )
        );
        const res: AxiosResponse<ResponseType<TaskType>> = yield call(
            todolistAPI.updateTask,
            action.todoListID,
            action.taskID,
            apiModel
        );
        if (res.data.resultCode === 0) {
            yield put(updateTaskAC(action.todoListID, action.taskID, apiModel));
            yield put(setAppStatus("succeeded"));
            yield put(
                changeTaskEntityStatusAC(
                    action.todoListID,
                    action.taskID,
                    "succeeded"
                )
            );
        } else {
            handleServerAppError(res.data, put);
        }
    } catch (error) {
        handleServerNetworkError(error, put);
    }
}

export function* tasksWatcherSaga() {
    yield takeEvery("TASKS/FETCH-TASKS", fetchTasksWorkerSaga);
    yield takeEvery("TASKS/REMOVE-TASK", deleteTaskWorkerSaga);
    yield takeEvery("TASKS/CREATE-TASK", createTaskWorkerSaga);
    yield takeEvery("TASKS/UPDATA-TASK", updateTaskWorkerSaga);
}
