import { call, put } from "redux-saga/effects";
import {
    GetTasksResponse,
    TaskStatuses,
    todolistAPI,
    TodoTaskPriorities,
} from "../../../api/todolist-api";
import { setAppError, setAppStatus } from "../../../app/app-reducer";
import { setTasksAC } from "./tasks-reducer";
import { createTaskWorkerSaga, fetchTasksWorkerSaga } from "./tasks-sagas";

let fakeResponse: GetTasksResponse;

beforeEach(() => {
    fakeResponse = {
        totalCount: 0,
        error: "",
        items: [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId1",
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: "",
                deadline: "",
                addedDate: "",
            },
        ],
    };
});

test("fetchTasksWorkerSaga success flow", () => {
    const todoListId = "todoListId";

    const gen = fetchTasksWorkerSaga({
        type: "TASKS/FETCH-TASKS",
        todoListId: todoListId,
    });

    expect(gen.next().value).toEqual(put(setAppStatus("loading")));

    expect(gen.next().value).toEqual(call(todolistAPI.getTasks, todoListId));

    expect(gen.next(fakeResponse).value).toEqual(
        put(setTasksAC(todoListId, fakeResponse.items))
    );

    expect(gen.next().value).toEqual(put(setAppStatus("succeeded")));
    expect(gen.next().done).toBeTruthy();
});

test("fetchTasksWorkerSaga error flow", () => {
    const todoListID = "todoListId";
    const title = "Task title";

    const gen = createTaskWorkerSaga({
        type: "TASKS/CREATE-TASK",
        todoListID: todoListID,
        title: title,
    });

    expect(gen.next().value).toEqual(put(setAppStatus("loading")));

    expect(gen.next().value).toEqual(
        call(todolistAPI.createTask, todoListID, title)
    );

    expect(gen.throw({ message: "Some error" }).value).toEqual(
        put(setAppError("Some error"))
    );
    expect(gen.next().value).toEqual(put(setAppStatus("failed")));
});
