import {
    TaskStatuses,
    TaskType,
    TodoTaskPriorities,
    UpdateTaskModelType,
} from "../../../api/todolist-api";
import {
    RequestStatusType,
    SetAppErrorType,
    SetAppStatusType,
} from "../../../app/app-reducer";
import { fetchTasks } from "./tasks-sagas";
import {
    AddTodoListActionType,
    clearTodoListsDataType,
    RemoveTodoListActionType,
    SetTodoListActionType,
} from "./totolists-reducer";

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
};
export const tasksReducer = (
    state = initialState,
    action: TasksActionType
): TasksStateType => {
    switch (action.type) {
        case "SET-TODOLISTS": {
            const copy = { ...state };
            action.todoLists.forEach((tl) => {
                copy[tl.id] = [];
            });
            return copy;
        }
        case "SET-TASKS":
            return {
                ...state,
                [action.todoListId]: action.tasks.map((t) => ({
                    ...t,
                    entityStatus: "idle",
                })),
            };
        case "REMOVE-TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(
                    (tl) => tl.id !== action.taskId
                ),
            };
        case "ADD-TASK":
            return {
                ...state,
                [action.task.todoListId]: [
                    { ...action.task, entityStatus: "idle" },
                    ...state[action.task.todoListId],
                ],
            };
        case "UPDATE-TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map((task) =>
                    task.id === action.taskId
                        ? { ...task, ...action.model }
                        : task
                ),
            };
        case "ADD-TODOLIST":
            return {
                ...state,
                [action.todoList.id]: [],
            };
        case "REMOVE-TODOLIST": {
            let copyState = { ...state };
            delete copyState[action.id];
            return copyState;
        }
        case "CHANGE-TASK-ENTITY-STATUS": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map((task) =>
                    task.id === action.taskId
                        ? { ...task, entityStatus: action.entityStatus }
                        : task
                ),
            };
        }
        case "CLEAR-DATA":
            return {};
        default:
            return state;
    }
};

// Action Creators
export const setTasksAC = (todoListId: string, tasks: Array<TaskType>) =>
    ({ type: "SET-TASKS", tasks, todoListId } as const);
export const removeTaskAC = (todoListId: string, taskId: string) =>
    ({ type: "REMOVE-TASK", todoListId, taskId } as const);
export const addTaskAC = (task: TaskType) =>
    ({ type: "ADD-TASK", task } as const);
export const updateTaskAC = (
    todoListId: string,
    taskId: string,
    model: UpdateTaskModelType
) => ({ type: "UPDATE-TASK", model, todoListId, taskId } as const);
export const changeTaskEntityStatusAC = (
    todoListId: string,
    taskId: string,
    entityStatus: RequestStatusType
) =>
    ({
        type: "CHANGE-TASK-ENTITY-STATUS",
        todoListId,
        taskId,
        entityStatus,
    } as const);

// Types
export type TasksActionType =
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof changeTaskEntityStatusAC>
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodoListActionType
    | SetAppStatusType
    | SetAppErrorType
    | clearTodoListsDataType
    | ReturnType<typeof fetchTasks>;

export type UpdateDomainTaskModelType = {
    title?: string;
    description?: string;
    status?: TaskStatuses;
    priority?: TodoTaskPriorities;
    startDate?: string;
    deadline?: string;
};

export type TasksStateType = {
    [key: string]: TaskDomainType[];
};
export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType;
};
