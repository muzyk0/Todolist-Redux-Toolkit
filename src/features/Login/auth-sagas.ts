import { call, put, takeEvery } from "redux-saga/effects";
import { authAPI, LoginParamsType, ResponseType } from "../../api/todolist-api";
import { setAppStatus } from "../../app/app-reducer";
import {
    handleServerAppErrorSaga,
    handleServerNetworkErrorSaga,
} from "../../utils/error-utils";
import { clearTodoListsData } from "../TodoListsList/TodoList/totolists-reducer";
import { setIsLoggedIn } from "./authReducer";

export const login = (data: LoginParamsType) =>
    ({ type: "AUTH/LOGIN", data } as const);

export function* loginWorkerSaga(action: ReturnType<typeof login>) {
    try {
        yield put(setAppStatus("loading"));
        const res: ResponseType<{ userId: number }> = yield call(
            authAPI.login,
            action.data
        );
        if (res.resultCode === 0) {
            yield put(setIsLoggedIn(true));
            yield put(setAppStatus("succeeded"));
        } else {
            yield* handleServerAppErrorSaga(res);
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error);
    }
}

export const logout = () => ({ type: "AUTH/LOGOUT" } as const);

export function* logoutWorkerSaga(action: ReturnType<typeof logout>) {
    try {
        yield put(setAppStatus("loading"));
        const res: ResponseType = yield call(authAPI.logout);
        if (res.resultCode === 0) {
            yield put(setIsLoggedIn(false));
            yield put(clearTodoListsData());
            yield put(setAppStatus("succeeded"));
        } else {
            yield* handleServerAppErrorSaga(res);
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error);
    }
}

export function* authWatcherSaga() {
    yield takeEvery("AUTH/LOGIN", loginWorkerSaga);
    yield takeEvery("AUTH/LOGOUT", logoutWorkerSaga);
}
