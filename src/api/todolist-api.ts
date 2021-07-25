import axios from "axios";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "5a0cdbca-9689-4621-a5f0-b22378b0e052",
    },
});

// API
export const todolistAPI = {
    async getTodos(): Promise<Array<TodoListType>> {
        const res = await instance.get<Array<TodoListType>>("todo-lists");
        return res.data;
    },
    async createTodo(
        title: string
    ): Promise<ResponseType<{ item: TodoListType }>> {
        const res = await instance.post<ResponseType<{ item: TodoListType }>>(
            "todo-lists",
            { title }
        );
        return res.data;
    },
    async deleteTodo(todolistId: string): Promise<ResponseType> {
        const res = await instance.delete<ResponseType>(
            `todo-lists/${todolistId}`
        );
        return res.data;
    },
    async updateTodoTitle(
        todolistId: string,
        title: string
    ): Promise<ResponseType> {
        const res = await instance.put<ResponseType>(
            `todo-lists/${todolistId}`,
            {
                title,
            }
        );
        return res.data;
    },

    async getTasks(todolistId: string): Promise<GetTasksResponse> {
        const res = await instance.get<GetTasksResponse>(
            `/todo-lists/${todolistId}/tasks`
        );
        return res.data;
    },
    async createTask(
        todolistId: string,
        title: string
    ): Promise<ResponseType<{ item: TaskType }>> {
        const res = await instance.post<ResponseType<{ item: TaskType }>>(
            `/todo-lists/${todolistId}/tasks`,
            {
                title,
            }
        );
        return res.data;
    },
    async updateTask(
        todolistId: string,
        taskId: string,
        model: UpdateTaskModelType
    ): Promise<ResponseType<TaskType>> {
        const res = await instance.put<ResponseType<TaskType>>(
            `/todo-lists/${todolistId}/tasks/${taskId}`,
            model
        );
        return res.data;
    },
    async deleteTask(
        todolistId: string,
        taskId: string
    ): Promise<ResponseType> {
        const res = await instance.delete<ResponseType>(
            `/todo-lists/${todolistId}/tasks/${taskId}`
        );
        return res.data;
    },
};

export const authAPI = {
    async login(data: LoginParamsType): Promise<ResponseType> {
        const res = await instance.post<ResponseType<{ userId: number }>>(
            "auth/login",
            data
        );
        return res.data;
    },
    async logout(): Promise<ResponseType> {
        const res = await instance.delete<ResponseType>("auth/login");
        return res.data;
    },
    async me(): Promise<ResponseType<AuthMeType>> {
        const res = await instance.get<ResponseType<AuthMeType>>("auth/me");
        return res.data;
    },
};

// Types
export enum TaskStatuses {
    New,
    InProgress,
    Completed,
    Draft,
}

export enum TodoTaskPriorities {
    Low,
    Middle,
    Hi,
    Urgently,
    Later,
}

export type ResponseType<T = {}> = {
    resultCode: number;
    messages: Array<string>;
    fieldsErrors: Array<string>;
    data: T;
};
export type GetTasksResponse = {
    totalCount: number;
    error: string | null;
    items: Array<TaskType>;
};
export type TodoListType = {
    id: string;
    title: string;
    addedDate: string;
    order: number;
};
export type TaskType = {
    id: string;
    title: string;
    description: string;
    todoListId: string;
    order: number;
    status: TaskStatuses;
    priority: TodoTaskPriorities;
    startDate: string;
    deadline: string;
    addedDate: string;
};
export type UpdateTaskModelType = {
    title: string;
    description: string;
    status: TaskStatuses;
    priority: TodoTaskPriorities;
    startDate: string;
    deadline: string;
};

export type LoginParamsType = {
    email: string;
    password: string;
    rememberMe: boolean;
    captcha?: string;
};

export type AuthMeType = {
    id: number;
    email: string;
    login: string;
};
