import {authAPI} from '../api/todolist-api';
import {setIsLoggedIn} from '../features/Login/authReducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';

/**
 * Thunk
 * */
export const initializeApp = createAsyncThunk('app/initializeApp', async (param, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn({isLoggedIn: true}))
            return
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        const error: AxiosError = e
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(error.message)
    }
})

/**
 * Reducers
 * */
const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        // setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
        //     state.isInitialized = action.payload.isInitialized
        // }
    },
    extraReducers: builder => {
        builder
            .addCase(initializeApp.fulfilled, (state) => {
                state.isInitialized = true
            })
    }
})

export const appReducer = slice.reducer
export const {
    setAppStatus,
    setAppError,
} = slice.actions


/**
 * Types
 * */
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = typeof initialState