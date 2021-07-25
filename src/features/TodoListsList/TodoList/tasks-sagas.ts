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
    handleServerAppErrorSaga,
    handleServerNetworkErrorSaga,
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
        const res: GetTasksResponse = yield call(
            todolistAPI.getTasks,
            action.todoListId
        );
        const tasks = res.items;
        yield put(setTasksAC(action.todoListId, tasks));
        yield put(setAppStatus("succeeded"));
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error);
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
        const res: ResponseType = yield call(
            todolistAPI.deleteTask,
            action.todoListID,
            action.taskID
        );

        if (res.resultCode === 0) {
            yield put(removeTaskAC(action.todoListID, action.taskID));
            yield put(setAppStatus("succeeded"));
        } else {
            yield* handleServerAppErrorSaga(res);
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error);
    }
}

export const createTask = (todoListID: string, title: string) =>
    ({
        type: "TASKS/CREATE-TASK",
        todoListID,
        title,
    } as const);

export function* createTaskWorkerSaga(action: ReturnType<typeof createTask>) {
    try {
        yield put(setAppStatus("loading"));
        const res: ResponseType<{ item: TaskType }> = yield call(
            todolistAPI.createTask,
            action.todoListID,
            action.title
        );
        if (res.resultCode === 0) {
            yield put(addTaskAC(res.data.item));
            yield put(setAppStatus("succeeded"));
        } else {
            yield* handleServerAppErrorSaga(res);
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error);
    }
}

export const updateTask = (
    todoListID: string,
    taskID: string,
    model: UpdateDomainTaskModelType
) => ({
    type: "TASKS/UPDATE-TASK",
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
        const res: ResponseType<TaskType> = yield call(
            todolistAPI.updateTask,
            action.todoListID,
            action.taskID,
            apiModel
        );
        if (res.resultCode === 0) {
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
            yield* handleServerAppErrorSaga(res);
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error);
    }
}

export function* tasksWatcherSaga() {
    yield takeEvery("TASKS/FETCH-TASKS", fetchTasksWorkerSaga);
    yield takeEvery("TASKS/REMOVE-TASK", deleteTaskWorkerSaga);
    yield takeEvery("TASKS/CREATE-TASK", createTaskWorkerSaga);
    yield takeEvery("TASKS/UPDATE-TASK", updateTaskWorkerSaga);
}
