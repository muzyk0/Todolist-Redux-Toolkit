import {TaskStatuses, TaskType, todolistAPI, TodoTaskPriorities, UpdateTaskModelType,} from '../../../api/todolist-api';

import {RequestStatusType, setAppStatus} from '../../../app/app-reducer';
import {AppRootStateType} from '../../../app/store';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {handleServerAppError, handleServerNetworkError,} from '../../../utils/error-utils';
import {clearTodoListsData, createTodoList, deleteTodoList, fetchTodoLists} from './totolists-reducer';
import {AxiosError} from 'axios';


const initialState: TasksStateType = {}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todoListId: string, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.getTasks(todoListId)
        const tasks = res.data.items
        dispatch(setAppStatus({status: 'succeeded'}))
        return {todoListId, tasks}
    } catch (e) {
        const error: AxiosError = e
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(error.message)
    }
})
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (param: { todoListID: string, taskID: string }, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.deleteTask(param.todoListID, param.taskID)

        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
        return {todoListID: param.todoListID, taskID: param.taskID}
    } catch (e) {
        const error: AxiosError = e
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(error.message)
    }
})
export const createTask = createAsyncThunk('tasks/createTask', async (param: { todoListID: string, title: string }, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.createTask(param.todoListID, param.title)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}))
            return {task: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        const error: AxiosError = e
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(error.message)
    }
})

export const updateTask = createAsyncThunk('tasks/updateTask', async (param: { todoListId: string, taskId: string, model: UpdateDomainTaskModelType }, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    const {todoListId, taskId, model} = param

    const currentTask = (getState() as AppRootStateType).tasks[todoListId].find(t => (t.id === taskId))
    if (!currentTask) {
        return rejectWithValue('Task not found in the state')
    }

    const apiModel: UpdateTaskModelType = {
        title: currentTask.title,
        status: currentTask.status,
        deadline: currentTask.deadline,
        description: currentTask.description,
        priority: currentTask.priority,
        startDate: currentTask.startDate,
        ...model
    }

    try {
        dispatch(setAppStatus({status: 'loading'}))
        dispatch(changeTaskEntityStatusAC({todoListId: todoListId, taskId: taskId, entityStatus: 'loading'}))
        const res = await todolistAPI.updateTask(todoListId, taskId, apiModel)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}))
            dispatch(changeTaskEntityStatusAC({todoListId: todoListId, taskId: taskId, entityStatus: 'succeeded'}))
            return {todoListId: todoListId, taskId: taskId, model: apiModel}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
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
const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {

        changeTaskEntityStatusAC: (state, action: PayloadAction<{ todoListId: string, taskId: string, entityStatus: RequestStatusType }>) => {
            state[action.payload.todoListId] = state[action.payload.todoListId]
                .map(task => task.id === action.payload.taskId
                    ? {...task, entityStatus: action.payload.entityStatus}
                    : task)
        },

    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodoLists.fulfilled, (state, action) => {
            action.payload.todoLists.forEach(tl => {
                state[tl.id] = []
            })
        })
            .addCase(createTodoList.fulfilled, (state, action) => {
                state[action.payload.todoList.id] = []
            })
            .addCase(deleteTodoList.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(clearTodoListsData, () => {
                return {}
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todoListId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListID];
                const index = tasks.findIndex((tl) => tl.id === action.payload.taskID)
                if (index > -1) {
                    tasks.splice(index, 1)
                }
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId] = [{
                    ...action.payload.task,
                    entityStatus: 'idle'
                }, ...state[action.payload.task.todoListId]]
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId];
                const index = tasks.findIndex(tl => tl.id === action.payload.taskId)
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model}
                }
            })
    }
})


export const tasksReducer = slice.reducer;
export const {
    changeTaskEntityStatusAC,
} = slice.actions

/**
 * Types
 * */
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TodoTaskPriorities
    startDate?: string
    deadline?: string
}

export type TasksStateType = {
    [key: string]: TaskDomainType[]
}
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}