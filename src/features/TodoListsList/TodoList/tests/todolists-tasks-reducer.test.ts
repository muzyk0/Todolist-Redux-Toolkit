import {tasksReducer, TasksStateType} from '../tasks-reducer';
import {createTodoList, TodoListDomainType, todoListsReducer} from '../totolists-reducer';
import {TodoListType} from '../../../../api/todolist-api';

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodoListsState: Array<TodoListDomainType> = [];

    const todoList: TodoListType = {
        title: 'new todolist',
        id: 'any id',
        addedDate: '',
        order: 0
    }

    const action = createTodoList.fulfilled({todoList}, 'requestId', todoList.title);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListsReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.payload.todoList.id);
    expect(idFromTodoLists).toBe(action.payload.todoList.id);
});
