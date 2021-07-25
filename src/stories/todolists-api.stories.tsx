import React, { useEffect, useState } from "react";
import { todolistAPI } from "../api/todolist-api";

export default {
    title: "API",
};

export const GetTodoLists = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке

        todolistAPI.getTodos().then((res) => {
            setState(res);
        });
    }, []);

    return <div> {JSON.stringify(state)}</div>;
};
export const CreateTodoList = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        const title = "React";
        todolistAPI.createTodo(title).then((res) => {
            setState(res.data);
        });
    }, []);

    return <div> {JSON.stringify(state)}</div>;
};
export const DeleteTodoList = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        const todolistId = "91af118b-3e80-4be5-ab27-5f7a8ffb4f4e";
        todolistAPI.deleteTodo(todolistId).then((res) => {
            setState(res.data);
        });
    }, []);

    return <div> {JSON.stringify(state)}</div>;
};
export const UpdateTodoListTitle = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        const todolistId = "9ab50878-7ffc-47e2-8ea7-2c6a0fde367b";
        const title = "YoYo Yopta";
        todolistAPI.updateTodoTitle(todolistId, title).then((res) => {
            setState(res.data);
        });
    }, []);

    return <div> {JSON.stringify(state)}</div>;
};

export const GetTodoListTasks = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        const todolistId = "ec35489d-6029-4b51-8b09-79193511b714";
        todolistAPI.getTasks(todolistId).then((res) => {
            setState(res);
        });
    }, []);

    return <div> {JSON.stringify(state)}</div>;
};
export const CreateTodoListTask = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        const todolistId = "ec35489d-6029-4b51-8b09-79193511b714";
        const title = "YoYo man";
        todolistAPI.createTask(todolistId, title).then((res) => {
            setState(res.data);
        });
    }, []);

    return <div> {JSON.stringify(state)}</div>;
};

export const UpdateTodoListTask = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        const todolistId = "ec35489d-6029-4b51-8b09-79193511b714";
        const taskId = "3802b3f2-3bc7-4e4d-b4eb-26f81bc5ccaa";
        const title = "Updated Task 2";
        todolistAPI
            .updateTask(todolistId, taskId, {
                title: title,
                description: "string",
                status: 1,
                priority: 1,
                startDate: "",
                deadline: "",
            })
            .then((res) => {
                setState(res.data);
            });
    }, []);

    return <div> {JSON.stringify(state)}</div>;
};
export const DeleteTodoListTask = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        const todolistId = "ec35489d-6029-4b51-8b09-79193511b714";
        const taskId = "3802b3f2-3bc7-4e4d-b4eb-26f81bc5ccaa";
        todolistAPI.deleteTask(todolistId, taskId).then((res) => {
            setState(res.data);
        });
    }, []);

    return <div> {JSON.stringify(state)}</div>;
};
