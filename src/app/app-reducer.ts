export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
};

export type InitialStateType = typeof initialState;

export const appReducer = (
    state: InitialStateType = initialState,
    action: appActionActionsType
): InitialStateType => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return { ...state, status: action.status };
        case "APP/SET-ERROR":
            return { ...state, error: action.error };
        case "APP/SET-IS-INITIALIZED":
            return { ...state, isInitialized: action.isInitialized };
        default:
            return state;
    }
};

// Action Creators
export const setAppStatus = (status: RequestStatusType) =>
    ({ type: "APP/SET-STATUS", status } as const);
export const setAppError = (error: string | null) =>
    ({ type: "APP/SET-ERROR", error } as const);
export const setIsInitialized = (isInitialized: boolean) =>
    ({ type: "APP/SET-IS-INITIALIZED", isInitialized } as const);

// Types
export type SetAppStatusType = ReturnType<typeof setAppStatus>;
export type SetAppErrorType = ReturnType<typeof setAppError>;
export type setIsInitializedType = ReturnType<typeof setIsInitialized>;
export type appActionActionsType =
    | SetAppStatusType
    | SetAppErrorType
    | setIsInitializedType;
