import {authAPI, LoginParamsType} from '../../api/todolist-api';
import {setAppStatus} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {clearTodoListsData} from '../TodoListsList/TodoList/totolists-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Dispatch} from 'redux';



/**
 * Thunk
 * */
export const LoginTC = (data: LoginParamsType) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn({isLoggedIn: true}))
            dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const LogoutTC = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn({isLoggedIn: false}))
            dispatch(clearTodoListsData())
            dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}

/**
 * Reducers
 * */
const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{isLoggedIn: boolean}>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

export const {setIsLoggedIn} = slice.actions
export const authReducer = slice.reducer

/**
 * Types
 * */
// export type AuthReducerActionType = ReturnType<typeof setIsLoggedIn> | SetAppStatusType | SetAppErrorType