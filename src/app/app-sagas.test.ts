import { call, put } from "redux-saga/effects";
import { authAPI, AuthMeType, ResponseType } from "../api/todolist-api";
import { setIsLoggedIn } from "../features/Login/authReducer";
import { setIsInitialized } from "./app-reducer";
import { InitializeAppWorkerSaga } from "./app-sagas";

let fakeResponse: ResponseType<AuthMeType>;

beforeEach(() => {
    fakeResponse = {
        resultCode: 0,
        messages: [],
        fieldsErrors: [],
        data: { email: "", id: 1, login: "" },
    };
});

test("initializeAppWorkerSaga", () => {
    const gen = InitializeAppWorkerSaga();
    expect(gen.next().value).toEqual(call(authAPI.me));

    expect(gen.next(fakeResponse).value).toEqual(put(setIsLoggedIn(true)));

    expect(gen.next().value).toEqual(put(setIsInitialized(true)));

    expect(gen.next().done).toBeTruthy();
});

test("initializeAppWorkerSaga login unsuccess", () => {
    const gen = InitializeAppWorkerSaga();

    expect(gen.next().value).toEqual(call(authAPI.me));

    fakeResponse.resultCode = 1;

    expect(gen.next(fakeResponse).value).toEqual(put(setIsInitialized(true)));

    expect(gen.next().done).toBeTruthy();
});
