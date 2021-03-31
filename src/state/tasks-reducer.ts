import {TasksStateType, TasksType} from '../App';
import {v1} from 'uuid';
import {AddTodoListActionType} from './totolists-reducer';

type removeTaskActionType = {
    type: 'REMOVE-TASK'
    taskId: string
    todoListId: string
}
type addTaskActionType = {
    type: 'ADD-TASK'
    title: string
    todoListId: string
}
type changeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS'
    taskId: string
    isDone: boolean
    todoListId: string
}
type changeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE'
    taskId: string
    title: string
    todoListId: string
}



export type ActionType = removeTaskActionType
    | addTaskActionType
    | changeTaskStatusActionType
    | changeTaskTitleActionType
    | AddTodoListActionType

export const tasksReducer = (state: TasksStateType, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            let copyState = {...state}
            copyState[action.todoListId] = copyState[action.todoListId].filter(tl => tl.id !== action.taskId)
            return copyState
        }
        case 'ADD-TASK': {
            const newTask: TasksType = {
                id: v1(),
                title: action.title,
                isDone: false
            }
            return {
                ...state,
                [action.todoListId]: [newTask, ...state[action.todoListId]]
            }
        }
        case 'CHANGE-TASK-STATUS': {
            const updatedTasks = state[action.todoListId]
                .map(task => task.id === action.taskId
                    ? {...task, isDone: action.isDone}
                    : task)

            return {
                ...state,
                [action.todoListId]: updatedTasks
            }
        }
        case 'CHANGE-TASK-TITLE': {
            const updatedTasks = state[action.todoListId]
                .map(task => task.id === action.taskId
                    ? {...task, title: action.title}
                    : task)

            return {
                ...state,
                [action.todoListId]: updatedTasks
            }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todoListId]: []
            }
        }
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todoListId: string): removeTaskActionType => {
    return {type: 'REMOVE-TASK', taskId, todoListId}
}
export const addTaskAC = (title: string, todoListId: string): addTaskActionType => {
    return {type: 'ADD-TASK', title, todoListId}
}
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todoListId: string): changeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', taskId, isDone, todoListId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todoListId: string): changeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todoListId}
}
