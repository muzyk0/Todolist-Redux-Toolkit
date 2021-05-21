import {todolistAPI, TodoListType} from '../../../api/todolist-api';
import {AppThunk} from '../../../app/store';
import {RequestStatusType, setAppStatus, SetAppStatusType} from '../../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../../utils/error-utils';

const initialState: TodoListDomainType[] = []

export const todoListsReducer = (state: TodoListDomainType[] = initialState, action: TodoListActionType): TodoListDomainType[] => {
    switch (action.type) {
        case 'SET-TODOLISTS':
            return action.todoLists.map(tl => ({...tl,filter: 'all', entityStatus: 'idle'}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todoList,filter: 'all', entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
        default:
            return state
    }
}

// Action Creators
export const setTodoListAC = (todoLists: Array<TodoListType>) => ({type: 'SET-TODOLISTS', todoLists} as const)
export const removeTodoListAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todoList: TodoListType) => ({type: 'ADD-TODOLIST', todoList} as const)
export const changeTodoListTitleAC = (id: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
export const changeTodoListFilterAC = (id: string, filter: FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', id, filter} as const)
export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) => ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, entityStatus} as const)

// Thunk Creators
// Async/Await func
export const fetchTodoLists = (): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus('loading'))
        const res = await todolistAPI.getTodos()
        dispatch(setTodoListAC(res.data))
        dispatch(setAppStatus('succeeded'))
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const createTodoList = (title: string): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus('loading'))
        const res = await todolistAPI.createTodo(title)
        if (res.data.resultCode === 0) {
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setAppStatus('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const deleteTodoList = (todoListId: string): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus('loading'))
        dispatch(changeTodolistEntityStatusAC(todoListId, 'loading'))
        const res = await todolistAPI.deleteTodo(todoListId)
        if (res.data.resultCode === 0) {
            dispatch(removeTodoListAC(todoListId))
            dispatch(setAppStatus('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}
export const updateTodoListTitle = (todolistId: string, title: string): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus('loading'))
        const res = await todolistAPI.updateTodoTitle(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(changeTodoListTitleAC(todolistId, title))
            dispatch(setAppStatus('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}

// Types
export type SetTodoListActionType = ReturnType<typeof setTodoListAC>
export type AddTodoListActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>
export type changeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatusAC>

export type TodoListActionType =
    | SetTodoListActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetAppStatusType
    | changeTodolistEntityStatusType
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}