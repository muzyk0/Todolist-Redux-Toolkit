import {authAPI, FieldErrorType, LoginParamsType} from '../../api/todolist-api';
import {setAppStatus} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {clearTodoListsData} from '../TodoListsList/TodoList/totolists-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';


export const LoginTC = createAsyncThunk<undefined, LoginParamsType, {
    rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}>('login/LoginTC', async (data: LoginParamsType, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}))
            return
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e) {
        const error: AxiosError = e
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})

export const LogoutTC = createAsyncThunk('tasks/LogoutTC', async (param, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(clearTodoListsData())
            dispatch(setAppStatus({status: 'succeeded'}))
            return
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e) {
        const error: AxiosError = e
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(error.message)
    }
})


// Reducers
const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: builder => {
        builder
            .addCase(LoginTC.fulfilled, (state) => {
                state.isLoggedIn = true
            })
            .addCase(LogoutTC.fulfilled, (state) => {
                state.isLoggedIn = false
            })
    }
})

export const {setIsLoggedIn} = slice.actions
export const authReducer = slice.reducer

// Types
// export type AuthReducerActionType = ReturnType<typeof setIsLoggedIn> | SetAppStatusType | SetAppErrorType