import {TaskStatuses, TaskType, todolistAPI, TodoTaskPriorities, UpdateTaskModelType,} from '../../../api/todolist-api';

import {RequestStatusType, setAppStatus} from '../../../app/app-reducer';
import {AppRootStateType} from '../../../app/store';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {handleServerAppError, handleServerNetworkError,} from '../../../utils/error-utils';
import {Dispatch} from 'redux';
import {addTodolistAC, clearTodoListsData, removeTodoListAC, setTodoListAC} from './totolists-reducer';


const initialState: TasksStateType = {}

/**
 * Thunk
 * */
export const deleteTask = (todoListID: string, taskID: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.deleteTask(todoListID, taskID)

        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC({todoListId: todoListID, taskId: taskID}))
            dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const createTask = (todoListID: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.createTask(todoListID, title)
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC({task: res.data.data.item}))
            dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const updateTask = (todoListID: string, taskID: string, model: UpdateDomainTaskModelType) => async (dispatch: Dispatch, getState: () => AppRootStateType) => {

    const currentTask = getState().tasks[todoListID].find(t => (t.id === taskID))
    if (!currentTask) {
        console.warn('Task not found in the state')
        return
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
        dispatch(changeTaskEntityStatusAC({todoListId: todoListID, taskId: taskID, entityStatus: 'loading'}))
        const res = await todolistAPI.updateTask(todoListID, taskID, apiModel)
        if (res.data.resultCode === 0) {
            dispatch(updateTaskAC({todoListId: todoListID, taskId: taskID, model: apiModel}))
            dispatch(setAppStatus({status: 'succeeded'}))
            dispatch(changeTaskEntityStatusAC({todoListId: todoListID, taskId: taskID, entityStatus: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}

export const fetchTasks = (todoListId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatus({status: 'loading'}))
        const res = await todolistAPI.getTasks(todoListId)
        const tasks = res.data.items
        dispatch(setTasksAC({todoListId: todoListId, tasks: tasks}))
        dispatch(setAppStatus({status: 'succeeded'}))
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}



/**
 * Reducers
 * */
const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        setTasksAC: (state, action: PayloadAction<{ todoListId: string, tasks: Array<TaskType> }>) => {
            state[action.payload.todoListId] = action.payload.tasks.map(t => ({...t, entityStatus: 'idle'}))
        },
        removeTaskAC: (state, action: PayloadAction<{ todoListId: string, taskId: string }>) => {
            const tasks = state[action.payload.todoListId];
            const index = tasks.findIndex(tl => tl.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
        addTaskAC: (state, action: PayloadAction<{ task: TaskType }>) => {
            //state[action.payload.task.todoListId].unshift(action.payload.task)
            state[action.payload.task.todoListId] = [{
                ...action.payload.task,
                entityStatus: 'idle'
            }, ...state[action.payload.task.todoListId]]
        },
        updateTaskAC: (state, action: PayloadAction<{ todoListId: string, taskId: string, model: UpdateTaskModelType }>) => {
            const tasks = state[action.payload.todoListId];
            const index = tasks.findIndex(tl => tl.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        changeTaskEntityStatusAC: (state, action: PayloadAction<{ todoListId: string, taskId: string, entityStatus: RequestStatusType }>) => {
            state[action.payload.todoListId] = state[action.payload.todoListId]
                .map(task => task.id === action.payload.taskId
                    ? {...task, entityStatus: action.payload.entityStatus}
                    : task)
        },

    },
    extraReducers: (builder) => {
        builder.addCase(setTodoListAC, (state, action) => {
            action.payload.todoLists.forEach(tl => {
                state[tl.id] = []
            })
        });
        builder.addCase(addTodolistAC, (state, action) => {
                state[action.payload.todoList.id] = []
            });
        builder.addCase(removeTodoListAC, (state, action) => {
                delete state[action.payload.id]
            });
        builder.addCase(clearTodoListsData, () => {
                return {}
            });
    }
})


export const tasksReducer = slice.reducer;
export const {
    setTasksAC,
    removeTaskAC,
    addTaskAC,
    updateTaskAC,
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