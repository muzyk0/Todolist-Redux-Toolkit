import {
    TaskStatuses,
    TodoListType,
    TodoTaskPriorities,
    UpdateTaskModelType,
} from "../../../../api/todolist-api";
import {
    addTaskAC,
    removeTaskAC,
    TaskDomainType,
    tasksReducer,
    TasksStateType,
    updateTaskAC,
} from "../tasks-reducer";
import { addTodolistAC, removeTodoListAC } from "../totolists-reducer";

let startState: TasksStateType;
beforeEach(() => {
    startState = {
        todolistId1: [
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
                entityStatus: "idle",
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.Completed,
                description: "",
                todoListId: "todolistId1",
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: "",
                deadline: "",
                addedDate: "",
                entityStatus: "idle",
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId1",
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: "",
                deadline: "",
                addedDate: "",
                entityStatus: "idle",
            },
        ],
        todolistId2: [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId2",
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: "",
                deadline: "",
                addedDate: "",
                entityStatus: "idle",
            },
            {
                id: "2",
                title: "milk",
                status: TaskStatuses.Completed,
                description: "",
                todoListId: "todolistId2",
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: "",
                deadline: "",
                addedDate: "",
                entityStatus: "idle",
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId2",
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: "",
                deadline: "",
                addedDate: "",
                entityStatus: "idle",
            },
        ],
    };
});

test("correct task should be deleted from correct array", () => {
    const action = removeTaskAC("todolistId2", "2");

    const endState = tasksReducer(startState, action);

    expect(endState).toEqual({
        todolistId1: [
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
                entityStatus: "idle",
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.Completed,
                description: "",
                todoListId: "todolistId1",
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: "",
                deadline: "",
                addedDate: "",
                entityStatus: "idle",
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId1",
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: "",
                deadline: "",
                addedDate: "",
                entityStatus: "idle",
            },
        ],
        todolistId2: [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId2",
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: "",
                deadline: "",
                addedDate: "",
                entityStatus: "idle",
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId2",
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: "",
                deadline: "",
                addedDate: "",
                entityStatus: "idle",
            },
        ],
    });
});
test("correct task should be added to correct array", () => {
    const task: TaskDomainType = {
        id: "1",
        title: "juce",
        todoListId: "todolistId2",
        order: 0,
        priority: 1,
        status: TaskStatuses.New,
        description: "",
        deadline: "",
        addedDate: "",
        startDate: "",
        entityStatus: "idle",
    };
    const action = addTaskAC(task);

    const endState = tasksReducer(startState, action);

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juce");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});
test("status of specified task should be changed", () => {
    const model: UpdateTaskModelType = {
        title: "New Title",
        status: TaskStatuses.New,
        description: "",
        deadline: "",
        startDate: "",
        priority: TodoTaskPriorities.Hi,
    };
    const action = updateTaskAC("todolistId2", "2", model);

    const endState = tasksReducer(startState, action);

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
});
test("title of specified task should be changed", () => {
    const model: UpdateTaskModelType = {
        title: "New Title",
        status: TaskStatuses.New,
        description: "",
        deadline: "",
        startDate: "",
        priority: TodoTaskPriorities.Hi,
    };
    const action = updateTaskAC("todolistId2", "2", model);

    const endState = tasksReducer(startState, action);

    expect(endState["todolistId1"][1].title).toBe("JS");
    expect(endState["todolistId2"][1].title).toBe("New Title");
});
test("new array should be added when new todolist is added", () => {
    const todoList: TodoListType = {
        id: "1",
        title: "new todolist",
        order: 0,
        addedDate: "",
    };
    const action = addTodolistAC(todoList);

    const endState = tasksReducer(startState, action);

    const keys = Object.keys(endState);
    const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added");
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test("property with todolistId should be deleted", () => {
    const action = removeTodoListAC("todolistId2");

    const endState = tasksReducer(startState, action);

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});
