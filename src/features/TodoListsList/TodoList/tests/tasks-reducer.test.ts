import {
    createTask,
    deleteTask,
    fetchTasks,
    TaskDomainType,
    tasksReducer,
    TasksStateType,
    updateTask
} from '../tasks-reducer';
import { createTodoList, deleteTodoList, fetchTodoLists} from '../totolists-reducer';
import {TaskStatuses, TodoListType, TodoTaskPriorities, UpdateTaskModelType} from '../../../../api/todolist-api';

let startState: TasksStateType
beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                description: '',
                todoListId: 'todolistId1',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            },
            {
                id: '2',
                title: 'JS',
                status: TaskStatuses.Completed,
                description: '',
                todoListId: 'todolistId1',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            },
            {
                id: '3',
                title: 'React',
                status: TaskStatuses.New,
                description: '',
                todoListId: 'todolistId1',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            }
        ],
        'todolistId2': [
            {
                id: '1',
                title: 'bread',
                status: TaskStatuses.New,
                description: '',
                todoListId: 'todolistId2',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            },
            {
                id: '2',
                title: 'milk',
                status: TaskStatuses.Completed,
                description: '',
                todoListId: 'todolistId2',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            },
            {
                id: '3',
                title: 'tea',
                status: TaskStatuses.New,
                description: '',
                todoListId: 'todolistId2',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            }
        ]
    };

})

test('correct task should be deleted from correct array', () => {
    const param = {todoListID: 'todolistId2', taskID: '2'};
    const action = deleteTask.fulfilled(param, 'requestId', param);

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'][1].id).not.toBe('2')
    expect(endState['todolistId2'].find(t => t.id === '2')).not.toBeDefined()
    expect(endState['todolistId2'].every(t => t.id != '2')).toBeTruthy();
    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1', title: 'CSS', status: TaskStatuses.New,
                description: '',
                todoListId: 'todolistId1',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            },
            {
                id: '2', title: 'JS', status: TaskStatuses.Completed,
                description: '',
                todoListId: 'todolistId1',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            },
            {
                id: '3', title: 'React', status: TaskStatuses.New,
                description: '',
                todoListId: 'todolistId1',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', status: TaskStatuses.New,
                description: '',
                todoListId: 'todolistId2',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            },
            {
                id: '3', title: 'tea', status: TaskStatuses.New,
                description: '',
                todoListId: 'todolistId2',
                order: 0,
                priority: TodoTaskPriorities.Hi,
                startDate: '',
                deadline: '',
                addedDate: '',
                entityStatus: 'idle',
            }
        ]
    });

});
test('correct task should be added to correct array', () => {
    const task: TaskDomainType = {
        id: '1',
        title: 'juce',
        todoListId: 'todolistId2',
        order: 0,
        priority: 1,
        status: TaskStatuses.New,
        description: '',
        deadline: '',
        addedDate: '',
        startDate: '',
        entityStatus: 'idle',
    }
    const action = createTask.fulfilled({task}, 'requestId', {title: task.title, todoListID: task.todoListId})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(4);
    expect(endState['todolistId2'][0].id).toBeDefined();
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})
test('status of specified task should be changed', () => {
    const model: UpdateTaskModelType = {
        title: 'New Title',
        status: TaskStatuses.New,
        description: '',
        deadline: '',
        startDate: '',
        priority: TodoTaskPriorities.Hi
    }
    let param = {todoListId: 'todolistId2', taskId: '2', model};
    const action = updateTask.fulfilled(param, 'requestId', param)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
});
test('title of specified task should be changed', () => {
    const model: UpdateTaskModelType = {
        title: 'New Title',
        status: TaskStatuses.New,
        description: '',
        deadline: '',
        startDate: '',
        priority: TodoTaskPriorities.Hi
    }
    let param = {todoListId: 'todolistId2', taskId: '2', model};
    const action = updateTask.fulfilled(param, 'requestId', param)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][1].title).toBe('JS')
    expect(endState['todolistId2'][1].title).toBe('New Title')
});
test('new array should be added when new todolist is added', () => {
    const todoList: TodoListType = {
        id: '1',
        title: 'new todolist',
        order: 0,
        addedDate: ''
    }
    const action = createTodoList.fulfilled({todoList}, 'requestId', todoList.title)

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([])
});

test('property with todolistId should be deleted', () => {

    const action = deleteTodoList.fulfilled({id: 'todolistId2'}, '', 'todolistId2');

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).not.toBeDefined();
});

test('empty arrays should be added when we set todolists', () => {
    let payload = {
        todoLists: [
            {id: '1', title: 'title 1', order: 0, addedDate: ''},
            {id: '2', title: 'title 2', order: 0, addedDate: ''}
        ]
    };
    const action = fetchTodoLists.fulfilled(payload, '')

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toBeDefined()
    expect(endState['2']).toBeDefined()
})
test('tasks should be added for todolist', () => {
    const action = fetchTasks.fulfilled({
        tasks: startState['todolistId1'],
        todoListId: 'todolistId1'
    }, 'requestId', 'todolistId1');

    const endState = tasksReducer({
        'todolistId2': [],
        'todolistId1': []
    }, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(0)
})
