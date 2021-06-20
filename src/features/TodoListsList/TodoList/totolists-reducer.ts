import {todolistAPI, TodoListType} from '../../../api/todolist-api';
import {RequestStatusType, setAppStatus} from '../../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {AxiosError} from 'axios';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: TodoListDomainType[] = []

export const fetchTodoLists = createAsyncThunk('todoList/fetchTodoLists', async (param, thunkAPI) => {


    // thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    // const res = await todolistAPI.getTodos()
    //
    // thunkAPI.dispatch(setTodoListAC({todoLists: res.data}))
    // thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
    // // res.data.forEach(tl => {
    // //     thunkAPI.dispatch(fetchTasks(tl.id))
    // // })

    // thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    // todolistAPI.getTodos()
    //     .then((res) => {
    //         thunkAPI.dispatch(setTodoListAC({todoLists: res.data}))
    //         thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
    //         return res.data
    //     })
    //     .then((todoLists) => {
    //         // todoLists.forEach(tl => {
    //         //     thunkAPI.dispatch(fetchTasks(tl.id))
    //         // })
    //     })
    //     .catch((error: AxiosError) => {
    //         handleServerNetworkError(error, thunkAPI.dispatch)
    //     })
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.getTodos()
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))

        // res.data.forEach(tl => {
        //     thunkAPI.dispatch(fetchTasks(tl.id))
        // })

        return {todoLists: res.data}
    } catch (e) {
        const error: AxiosError = e
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(error.message)
    }
})

export const deleteTodoList = createAsyncThunk('todoList/deleteTodoList', async (todoListId: string, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatus({status: 'loading'}))
        dispatch(changeTodolistEntityStatusAC({id: todoListId, entityStatus: 'loading'}))
        const res = await todolistAPI.deleteTodo(todoListId)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}))
            return {id: todoListId}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(error.message)
    }
})
export const createTodoList = createAsyncThunk('todoList/createTodoList', async (title: string, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.createTodo(title)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}))
            return {todoList: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(error.message)
    }
})
export const updateTodoListTitle = createAsyncThunk('todoList/updateTodoListTitle', async (param: {id: string, title: string}, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.updateTodoTitle(param.id, param.title)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}))
            return {id: param.id, title: param.title}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(error.message)
    }
})

/*
 * Reducers
 * */
const slice = createSlice({
    name: 'TodoLists',
    initialState: initialState,
    reducers: {
        // setTodoListAC: (state, action: PayloadAction<{ todoLists: Array<TodoListType> }>) => {
        //     return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        // },
        // removeTodoListAC: (state, action: PayloadAction<{ id: string }>) => {
        //     const index = state.findIndex(tl => tl.id === action.payload.id)
        //     if (index > -1) {
        //         state.splice(index, 1)
        //     }
        // },
        // addTodolistAC: (state, action: PayloadAction<{ todoList: TodoListType }>) => {
        //     state.unshift({...action.payload.todoList, filter: 'all', entityStatus: 'idle'})
        // },
        // changeTodoListTitleAC: (state, action: PayloadAction<{ id: string, title: string }>) => {
        //     const index = state.findIndex(tl => tl.id === action.payload.id)
        //     state[index].title = action.payload.title
        // },
        changeTodoListFilterAC: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        },
        clearTodoListsData: (state) => {
            state = []
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodoLists.fulfilled, (state, action) => {
            return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        })
            .addCase(deleteTodoList.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.id)
                if (index > -1) {
                    state.splice(index, 1)
                }
        })
            .addCase(createTodoList.fulfilled, (state, action) => {
                state.unshift({...action.payload.todoList, filter: 'all', entityStatus: 'idle'})
        })
            .addCase(updateTodoListTitle.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.id)
                state[index].title = action.payload.title
        })

    }
})


export const todoListsReducer = slice.reducer
export const {
    changeTodoListFilterAC,
    changeTodolistEntityStatusAC,
    clearTodoListsData,
} = slice.actions


/*
 * Types
 * */
export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}