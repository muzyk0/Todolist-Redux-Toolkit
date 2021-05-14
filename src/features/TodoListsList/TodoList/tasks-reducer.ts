import {AddTodoListActionType, RemoveTodoListActionType, SetTodoListActionType} from './totolists-reducer';
import {TaskStatuses, TaskType, todolistAPI, TodoTaskPriorities, UpdateTaskModelType} from '../../../api/todolist-api';
import {Dispatch} from 'redux';
import {AppRootStateType, AppThunk} from '../../../app/store';

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
export const tasksReducer = (state = initialState, action: TasksActionType): TasksStateType => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            const copy = {...state}
            action.todoLists.forEach(tl => {
                copy[tl.id] = []
            })
            return copy
        }
        case 'SET-TASKS':
            return {...state, [action.todoListId]: action.tasks}
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(tl => tl.id !== action.taskId)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(task => task.id === action.taskId
                        ? {...task, ...action.model}
                        : task)
            }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todoList.id]: []
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

// Action Creators
export const setTasksAC = (todoListId: string, tasks: Array<TaskType>) =>
    ({type: 'SET-TASKS', tasks, todoListId} as const)
export const removeTaskAC = (todoListId: string, taskId: string) =>
    ({type: 'REMOVE-TASK', todoListId, taskId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (todoListId: string, taskId: string, model: UpdateTaskModelType) =>
    ({type: 'UPDATE-TASK', model, todoListId, taskId} as const)

// Thunk Creators
export const fetchTasks = (todoListId: string): AppThunk => dispatch => {
    todolistAPI.getTasks(todoListId)
        .then(res => {
            const tasks = res.data.items
            dispatch(setTasksAC(todoListId, tasks))
        })
}
export const deleteTask = (todoListID: string, taskID: string): AppThunk => dispatch => {
    todolistAPI.deleteTask(todoListID, taskID)
        .then(() => {
            dispatch(removeTaskAC(todoListID, taskID))
        })
}
export const createTask = (todoListID: string, title: string): AppThunk => dispatch => {
    todolistAPI.createTask(todoListID, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
            }
        })
}
export const updateTask = (todoListID: string, taskID: string, model: UpdateDomainTaskModelType): AppThunk => (dispatch: Dispatch<TasksActionType>, getState: () => AppRootStateType) => {
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

    todolistAPI.updateTask(todoListID, taskID, {
        title: currentTask.title,
        status: currentTask.status,
        deadline: currentTask.deadline,
        description: currentTask.description,
        priority: currentTask.priority,
        startDate: currentTask.startDate,
        ...model
    })
        .then(() => {
            dispatch(updateTaskAC(todoListID, taskID, apiModel))
        })

}

// Types
export type TasksActionType =
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodoListActionType

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TodoTaskPriorities
    startDate?: string
    deadline?: string
}

export type TasksStateType = {
    [key: string]: TaskType[]
}
