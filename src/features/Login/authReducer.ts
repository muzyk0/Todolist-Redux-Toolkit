import { SetAppErrorType, SetAppStatusType } from "../../app/app-reducer";

const initialState = {
    isLoggedIn: false,
};
type InitialStateType = typeof initialState;

export const authReducer = (
    state: InitialStateType = initialState,
    action: AuthReducerActionType
): InitialStateType => {
    switch (action.type) {
        case "Login/SET-IS-LOGGED-IN":
            return { ...state, isLoggedIn: action.isLoggedIn };
        default:
            return state;
    }
};

// Actions
export const setIsLoggedIn = (isLoggedIn: boolean) =>
    ({
        type: "Login/SET-IS-LOGGED-IN",
        isLoggedIn,
    } as const);

// Types
export type AuthReducerActionType =
    | ReturnType<typeof setIsLoggedIn>
    | SetAppStatusType
    | SetAppErrorType;
