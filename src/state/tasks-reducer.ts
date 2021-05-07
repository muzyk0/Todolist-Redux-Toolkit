import {AddTodoListActionType, RemoveTodoListActionType, SetTodoListType} from './totolists-reducer';
import {TasksStateType} from '../App';
import {TaskStatuses, TaskType, todolistAPI} from '../api/todolist-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from './store';

type removeTaskActionType = {
    type: 'REMOVE-TASK'
    taskId: string
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
    | AddTaskACType
    | changeTaskStatusActionType
    | changeTaskTitleActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodoListType
    | SetTasksType

const initialState: TasksStateType = {
    /*"todolistId1": [
        { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ],
    "todolistId2": [
        { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
        { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
    ]*/
}

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
            const stateCopy = {...state}
            const tasks = stateCopy[action.task.todoListId]
            stateCopy[action.task.todoListId] = [action.task, ...tasks]
            return stateCopy
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
                [action.todoList.id]: []
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


export const setTasksAC = (tasks: Array<TaskType>, todoListId: string) => ({
    type: 'SET-TASKS', tasks, todoListId
} as const)
type SetTasksType = ReturnType<typeof setTasksAC>

export const removeTaskAC = (todoListId: string, taskId: string): removeTaskActionType => ({
    type: 'REMOVE-TASK', todoListId, taskId
})

export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
type AddTaskACType = ReturnType<typeof addTaskAC>

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
            dispatch(setTasksAC(tasks, todoListId))
        })
}
export const deleteTask = (todoListID: string, taskID: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTask(todoListID, taskID)
        .then(() => {
            dispatch(removeTaskAC(todoListID, taskID))
        })
}
export const createTask = (title: string, todoListID: string) => (dispatch: Dispatch) => {
    todolistAPI.createTask(todoListID, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
            }
        })
}
export const updateTaskStatus = (todolistId: string, taskId: string, status: TaskStatuses) => (dispatch: Dispatch, getState: () => AppRootStateType) => {

    const currentTask = getState().tasks[todolistId].find(t => (t.id === taskId))

    if (currentTask) {
        todolistAPI.updateTask(todolistId, taskId, {
            title: currentTask.title,
            status: status,
            deadline: currentTask.deadline,
            description: currentTask.description,
            priority: currentTask.priority,
            startDate: currentTask.startDate
        })
            .then(() => {
                dispatch(changeTaskStatusAC(taskId, status, todolistId))
            })
    }
}
export const updateTaskTitle = (taskID: string, title: string, todoListID: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const currentTask = getState().tasks[todoListID].find(t => (t.id === taskID))

    if (currentTask) {
        todolistAPI.updateTask(todoListID, taskID, {
            title: title,
            status: currentTask.status,
            deadline: currentTask.deadline,
            description: currentTask.description,
            priority: currentTask.priority,
            startDate: currentTask.startDate
        })
            .then(() => {
                dispatch(changeTaskTitleAC(taskID, title, todoListID))
            })
    }
}