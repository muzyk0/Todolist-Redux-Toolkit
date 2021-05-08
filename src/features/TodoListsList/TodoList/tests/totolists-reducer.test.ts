import {
    addTodolistAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC, FilterValuesType,
    removeTodoListAC, TodoListDomainType,
    todoListsReducer
} from '../totolists-reducer';
import {v1} from 'uuid';
import {TodoListType} from '../../../../api/todolist-api';

let todolistId1: string
let todolistId2: string
let startState: Array<TodoListDomainType>

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', order: 0, addedDate: ''},
        {id: todolistId2, title: 'What to buy', filter: 'all', order: 0, addedDate: ''}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todoListsReducer(startState, removeTodoListAC(todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    let newTodolistTitle = 'New Todolist'
    const todoList: TodoListType = {
        id: v1(),
        title: newTodolistTitle,
        order: 0,
        addedDate: ''
    }

    const endState = todoListsReducer(startState, addTodolistAC(todoList))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodolistTitle)
    expect(endState[0].filter).toBe('all')
})

test('correct todolist should change its name', () => {

    let newTodolistTitle = 'New Todolist'

    const action = changeTodoListTitleAC(todolistId2, newTodolistTitle)

    const endState = todoListsReducer(startState, action)

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = 'completed'

    const action = changeTodoListFilterAC(todolistId2, newFilter)

    const endState = todoListsReducer(startState, action)

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
});
