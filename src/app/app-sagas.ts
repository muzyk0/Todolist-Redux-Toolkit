import { AxiosResponse } from "axios";
import { call, put, takeEvery } from "redux-saga/effects";
import { authAPI, AuthMeType, ResponseType } from "../api/todolist-api";
import { setIsLoggedIn } from "../features/Login/authReducer";
import {
    handleServerAppError,
    handleServerNetworkError,
} from "../utils/error-utils";
import { setIsInitialized } from "./app-reducer";

// Sagas

export function* InitializeAppWorkerSaga() {
    try {
        const res: AxiosResponse<ResponseType<AuthMeType>> = yield call(
            authAPI.me
        );
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedIn(true));
        } else {
            handleServerAppError(res.data, put);
        }
    } catch (error) {
        handleServerNetworkError(error, put);
    } finally {
        yield put(setIsInitialized(true));
    }
}

export const InitializeApp = () => ({ type: "APP/INITIALIZE" });

export function* appWatcherSaga() {
    yield takeEvery("APP/INITIALIZE", InitializeAppWorkerSaga);
}
