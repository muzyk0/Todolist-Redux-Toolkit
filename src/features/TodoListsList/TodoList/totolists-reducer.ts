import {todolistAPI, TodoListType} from '../../../api/todolist-api';
import {AppThunk} from '../../../app/store';
import {setAppError, setAppStatus, SetAppStatusType} from '../../../app/app-reducer';

const initialState: TodoListDomainType[] = []

export const todoListsReducer = (state: TodoListDomainType[] = initialState, action: TodoListActionType): TodoListDomainType[] => {
    switch (action.type) {
        case 'SET-TODOLISTS':
            return action.todoLists.map(tl => ({...tl,filter: 'all'}))
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todoList,filter: 'all',}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
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

// Thunk Creators
// Async/Await func
export const fetchTodoLists = (): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatus('loading'))
        const response = await todolistAPI.getTodos()
        const todoLists = response.data
        dispatch(setTodoListAC(todoLists))
        dispatch(setAppStatus('succeeded'))
    } catch {
        console.log('error')
    }
}
export const createTodoList = (title: string): AppThunk => dispatch => {
    dispatch(setAppStatus('loading'))
    todolistAPI.createTodo(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
                setAppStatus('succeeded')
            } else {
                if (res.data.messages.length) {
                    dispatch(setAppError(res.data.messages[0]))
                } else {
                    dispatch(setAppError('Some error occurred'))
                }
                dispatch(setAppStatus('failed'))

            }
        })
}
export const deleteTodoList = (todoListId: string): AppThunk => dispatch => {
    dispatch(setAppStatus('loading'))
    todolistAPI.deleteTodo(todoListId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodoListAC(todoListId))
                setAppStatus('succeeded')
            }
        })
}
export const updateTodoListTitle = (todolistId: string, title: string): AppThunk => dispatch => {
    dispatch(setAppStatus('loading'))
    todolistAPI.updateTodoTitle(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodoListTitleAC(todolistId, title))
                setAppStatus('succeeded')
            }
        })
}

// Types
export type SetTodoListActionType = ReturnType<typeof setTodoListAC>
export type AddTodoListActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>

export type TodoListActionType =
    | SetTodoListActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetAppStatusType
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
}