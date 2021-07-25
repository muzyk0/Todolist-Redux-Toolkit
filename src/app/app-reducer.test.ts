import {
    appReducer,
    InitialStateType,
    setAppError,
    setAppStatus,
} from "./app-reducer";

let startValue: InitialStateType;

beforeEach(() => {
    startValue = {
        status: "idle",
        error: null,
        isInitialized: false,
    };
});

test("correct error message should be set", () => {
    const endState = appReducer(startValue, setAppError("some error"));

    expect(endState.error).toBe("some error");
});
test("correct status should be set", () => {
    const endState = appReducer(startValue, setAppStatus("loading"));

    expect(endState.status).toBe("loading");
});
