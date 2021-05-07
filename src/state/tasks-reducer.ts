import {v1} from 'uuid';
import {AddTodoListActionType, RemoveTodoListActionType, SetTodoListType} from './totolists-reducer';
import {TasksStateType} from '../App';
import {TaskStatuses, TaskType, todolistAPI, TodoTaskPriorities} from '../api/todolist-api';
import {Dispatch} from 'redux';

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
    status: TaskStatuses
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
    | RemoveTodoListActionType
    | SetTodoListType
    | SetTasksType

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            const copy = {...state}
            action.todoLists.forEach(tl => {
                copy[tl.id] = []
            })
            return copy
        }
        case 'SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todoListId] = action.tasks
            return stateCopy
        }
        case 'REMOVE-TASK': {
            let copyState = {...state}
            copyState[action.todoListId] = copyState[action.todoListId].filter(tl => tl.id !== action.taskId)
            return copyState
        }
        case 'ADD-TASK': {
            const newTask: TaskType = {
                id: v1(),
                title: action.title,
                description: '',
                todoListId: action.todoListId,
                order: 0,
                status: TaskStatuses.New,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            }
            return {
                ...state,
                [action.todoListId]: [newTask, ...state[action.todoListId]]
            }
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(task => task.id === action.taskId
                        ? {...task, status: action.status}
                        : task)
            }
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(task => task.id === action.taskId
                        ? {...task, title: action.title}
                        : task)
            }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todoListId]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            let copyState = {...state}
            delete copyState[action.id]
            return copyState
        }
        default:
            return state
    }
}


export const setTasks = (tasks: Array<TaskType>, todoListId: string) => ({
    type: 'SET-TASKS', tasks, todoListId
} as const)
type SetTasksType = ReturnType<typeof setTasks>

export const removeTaskAC = (taskId: string, todoListId: string): removeTaskActionType => {
    return {type: 'REMOVE-TASK', taskId, todoListId}
}
export const addTaskAC = (title: string, todoListId: string): addTaskActionType => {
    return {type: 'ADD-TASK', title, todoListId}
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todoListId: string): changeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', taskId, status, todoListId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todoListId: string): changeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todoListId}
}

// Thunk Creators

export const fetchTasks = (todoListId: string) => (dispatch: Dispatch) => {
    todolistAPI.getTasks(todoListId)
        .then(res => {
            const tasks = res.data.items
            dispatch(setTasks(tasks, todoListId))
        })

}

export const removeTask = (taskID: string, todoListID: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTask(taskID, todoListID)
        .then(() => {
            dispatch(removeTaskAC(taskID, todoListID))
        })

}