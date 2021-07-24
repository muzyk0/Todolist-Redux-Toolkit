import { TodoListType } from "../../../api/todolist-api";
import { RequestStatusType, SetAppStatusType } from "../../../app/app-reducer";

const initialState: TodoListDomainType[] = [];

export const todoListsReducer = (
    state: TodoListDomainType[] = initialState,
    action: TodoListActionType
): TodoListDomainType[] => {
    switch (action.type) {
        case "SET-TODOLISTS":
            return action.todoLists.map((tl) => ({
                ...tl,
                filter: "all",
                entityStatus: "idle",
            }));
        case "REMOVE-TODOLIST":
            return state.filter((tl) => tl.id !== action.id);
        case "ADD-TODOLIST":
            return [
                { ...action.todoList, filter: "all", entityStatus: "idle" },
                ...state,
            ];
        case "CHANGE-TODOLIST-TITLE":
            return state.map((tl) =>
                tl.id === action.id ? { ...tl, title: action.title } : tl
            );
        case "CHANGE-TODOLIST-FILTER":
            return state.map((tl) =>
                tl.id === action.id ? { ...tl, filter: action.filter } : tl
            );
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map((tl) =>
                tl.id === action.id
                    ? { ...tl, entityStatus: action.entityStatus }
                    : tl
            );
        case "CLEAR-DATA":
            return [];
        default:
            return state;
    }
};

// Action Creators
export const setTodoListAC = (todoLists: Array<TodoListType>) =>
    ({ type: "SET-TODOLISTS", todoLists } as const);
export const removeTodoListAC = (id: string) =>
    ({ type: "REMOVE-TODOLIST", id } as const);
export const addTodolistAC = (todoList: TodoListType) =>
    ({ type: "ADD-TODOLIST", todoList } as const);
export const changeTodoListTitleAC = (id: string, title: string) =>
    ({
        type: "CHANGE-TODOLIST-TITLE",
        id,
        title,
    } as const);
export const changeTodoListFilterAC = (id: string, filter: FilterValuesType) =>
    ({
        type: "CHANGE-TODOLIST-FILTER",
        id,
        filter,
    } as const);
export const changeTodolistEntityStatusAC = (
    id: string,
    entityStatus: RequestStatusType
) =>
    ({
        type: "CHANGE-TODOLIST-ENTITY-STATUS",
        id,
        entityStatus,
    } as const);
export const clearTodoListsData = () =>
    ({
        type: "CLEAR-DATA",
    } as const);

// Types
export type SetTodoListActionType = ReturnType<typeof setTodoListAC>;
export type AddTodoListActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>;
export type changeTodolistEntityStatusType = ReturnType<
    typeof changeTodolistEntityStatusAC
>;
export type clearTodoListsDataType = ReturnType<typeof clearTodoListsData>;

export type TodoListActionType =
    | SetTodoListActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetAppStatusType
    | changeTodolistEntityStatusType
    | clearTodoListsDataType
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>;

export type FilterValuesType = "all" | "active" | "completed";

export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};
