import {authAPI, LoginParamsType} from '../../api/todolist-api';
import {AppThunk} from '../../app/store';
import {SetAppErrorType, setAppStatus, SetAppStatusType} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AuthReducerActionType): InitialStateType => {
    switch (action.type) {
        case 'Login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.isLoggedIn}
        default: return state
    }
}

// Actions
export const setIsLoggedIn = (isLoggedIn: boolean) => ({
    type: 'Login/SET-IS-LOGGED-IN', isLoggedIn
} as const)

// Thunk
export const LoginTC = (data: LoginParamsType): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus('loading'))
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn(true))
            dispatch(setAppStatus('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const LogoutTC = (): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus('loading'))
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn(false))
            dispatch(setAppStatus('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}

// Types
export type AuthReducerActionType = ReturnType<typeof setIsLoggedIn> | SetAppStatusType | SetAppErrorType