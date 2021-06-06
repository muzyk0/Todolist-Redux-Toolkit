import {todolistAPI, TodoListType} from '../../../api/todolist-api';
import {RequestStatusType, setAppStatus} from '../../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';
import {AxiosError} from 'axios';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Dispatch} from 'redux';

const initialState: TodoListDomainType[] = []

/**
 * Thunks
 * */
export const fetchTodoLists = () => (dispatch: any) => {

    dispatch(setAppStatus({status: 'loading'}))
    todolistAPI.getTodos()
        .then((res) => {
            dispatch(setTodoListAC({todoLists: res.data}))
            dispatch(setAppStatus({status: 'succeeded'}))
            return res.data
        })
        .then((todoLists) => {
            // todoLists.forEach(tl => {
            //     dispatch(fetchTasks(tl.id))
            // })
        })
        .catch((error: AxiosError) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const createTodoList = (title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.createTodo(title)
        if (res.data.resultCode === 0) {
            dispatch(addTodolistAC({todoList: res.data.data.item}))
            dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const deleteTodoList = (todoListId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        dispatch(changeTodolistEntityStatusAC({id: todoListId, entityStatus: 'loading'}))
        const res = await todolistAPI.deleteTodo(todoListId)
        if (res.data.resultCode === 0) {
            dispatch(removeTodoListAC({id: todoListId}))
            dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const updateTodoListTitle = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.updateTodoTitle(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(changeTodoListTitleAC({id: todolistId, title: title}))
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
const slice = createSlice({
    name: 'TodoLists',
    initialState: initialState,
    reducers: {
        setTodoListAC: (state, action: PayloadAction<{ todoLists: Array<TodoListType> }>) => {
            return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        removeTodoListAC: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC: (state, action: PayloadAction<{ todoList: TodoListType }>) => {
            state.unshift({...action.payload.todoList, filter: 'all', entityStatus: 'idle'})
        },
        changeTodoListTitleAC: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
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
    }
})


export const todoListsReducer = slice.reducer
export const {
    setTodoListAC,
    removeTodoListAC,
    addTodolistAC,
    changeTodoListTitleAC,
    changeTodoListFilterAC,
    changeTodolistEntityStatusAC,
    clearTodoListsData,
} = slice.actions




/**
 * Types
 * */
export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}