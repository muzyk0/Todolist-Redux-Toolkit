import {Dispatch} from 'redux';
import {setAppError, setAppStatus} from '../app/app-reducer';
import {ResponseType} from '../api/todolist-api';
import {AxiosError} from 'axios'

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppError({error: data.messages[0]}))
    } else {
        dispatch(setAppError({error: 'Some error occurred'}))
    }
    dispatch(setAppStatus({status: 'failed'}))
}

// export const handleServerNetworkError = (error: {message: string}, dispatch: ErrorUtilsDispatchType) => {
export const handleServerNetworkError = (error: AxiosError, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppError({ error: error.message ? error.message: 'Some error occurred'}))
    dispatch(setAppStatus({status: 'failed'}))
}

// type ErrorUtilsDispatchType = Dispatch<SetAppErrorType | SetAppStatusType>
type ErrorUtilsDispatchType = Dispatch