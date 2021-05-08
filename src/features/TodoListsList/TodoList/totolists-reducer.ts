import {todolistAPI, TodoListType} from '../../../api/todolist-api';
import {Dispatch} from 'redux';

const initialState: TodoListDomainType[] = []

export const todoListsReducer = (state: TodoListDomainType[] = initialState, action: ActionType): TodoListDomainType[] => {
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
export const fetchTodoLists = () => (dispatch: Dispatch<ActionType>) => {
    todolistAPI.getTodos()
        .then((res) => {
            const todoLists = res.data
            dispatch(setTodoListAC(todoLists))
        })
}
export const createTodoList = (title: string) => (dispatch: Dispatch<ActionType>) => {
    todolistAPI.createTodo(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
            }
        })
}
export const deleteTodoList = (todoListId: string) => (dispatch: Dispatch<ActionType>) => {
    todolistAPI.deleteTodo(todoListId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodoListAC(todoListId))
            }
        })
}
export const updateTodoListTitle = (todolistId: string, title: string) => (dispatch: Dispatch<ActionType>) => {
    todolistAPI.updateTodoTitle(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodoListTitleAC(todolistId, title))
            }
        })
}

// Types
export type SetTodoListActionType = ReturnType<typeof setTodoListAC>
export type AddTodoListActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>

export type ActionType =
    | SetTodoListActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
}