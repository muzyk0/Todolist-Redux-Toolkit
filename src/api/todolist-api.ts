import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '5a0cdbca-9689-4621-a5f0-b22378b0e052'
    }
})

/**
 * API
 * */
export const todolistAPI = {
    getTodos() {
        return instance.get<Array<TodoListType>>('todo-lists')
    },
    createTodo(title: string) {
        return instance.post<ResponseType<{ item: TodoListType }>>('todo-lists', {title})
    },
    deleteTodo(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodoTitle(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
    },


    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, {
            title
        })
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<TaskType>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
    },
    deleteTask(todolistId: string, taskId: string,) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
}

export const authAPI = {
    login(data: LoginParamsType) {
        return instance.post<ResponseType<{ userId: number }>>('auth/login', data)
    },
    logout() {
        return instance.delete<ResponseType<{ userId: number }>>('auth/login')
    },
    me() {
        return instance.get<ResponseType<AuthMeType>>('auth/me')
    }
}

/**
 * Types
 * */
export enum TaskStatuses {
    New,
    InProgress,
    Completed,
    Draft
}

export enum TodoTaskPriorities {
    Low,
    Middle,
    Hi,
    Urgently,
    Later,
}

export type ResponseType<T = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: T
}
type GetTasksResponse = {
    totalCount: number
    error: string | null
    items: Array<TaskType>
}
export type TodoListType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type TaskType = {
    id: string
    title: string
    description: string,
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TodoTaskPriorities
    startDate: string
    deadline: string
    addedDate: string
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TodoTaskPriorities
    startDate: string
    deadline: string
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

type AuthMeType = {
    id: number
    email: string
    login: string
}