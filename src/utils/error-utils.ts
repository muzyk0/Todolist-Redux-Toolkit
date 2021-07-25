import { Dispatch } from "redux";
import {
    setAppError,
    SetAppErrorType,
    setAppStatus,
    SetAppStatusType,
} from "../app/app-reducer";
import { ResponseType } from "../api/todolist-api";
import { put } from "redux-saga/effects";

// generic function
export const handleServerAppError = <T>(
    data: ResponseType<T>,
    dispatch: ErrorUtilsDispatchType
) => {
    if (data.messages.length) {
        dispatch(setAppError(data.messages[0]));
    } else {
        dispatch(setAppError("Some error occurred"));
    }
    dispatch(setAppStatus("failed"));
};

export const handleServerNetworkError = (
    error: { message: string },
    dispatch: ErrorUtilsDispatchType
) => {
    dispatch(setAppError(error.message));
    dispatch(setAppStatus("failed"));
};

export function* handleServerAppErrorSaga<T>(data: ResponseType<T>) {
    if (data.messages.length) {
        yield put(setAppError(data.messages[0]));
    } else {
        yield put(setAppError("Some error occurred"));
    }
    yield put(setAppStatus("failed"));
}

export function* handleServerNetworkErrorSaga(error: { message: string }) {
    yield put(setAppError(error.message));
    yield put(setAppStatus("failed"));
}

type ErrorUtilsDispatchType = Dispatch<SetAppErrorType | SetAppStatusType>;
