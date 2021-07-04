import React from 'react'
import {action} from '@storybook/addon-actions'
import {Task, TaskPropsType} from './Task'
import {ReduxStoreProviderDecorator} from '../../../../stories/decorators/ReduxStoreProviderDecorator'
import {TaskPriorities, TaskStatuses} from '../../../../api/types'
import {Story} from '@storybook/react/types-6-0';

export default {
    title: 'Task Stories',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
}

const removeCallback = action('Remove Button inside Task clicked');
const changeStatusCallback = action('Status changed inside Task');
const changeTitleCallback = action('Title changed inside Task');

const Template: Story<TaskPropsType> = (args) => <Task {...args}/>

const baseArgs = {
    changeTaskStatus: changeStatusCallback,
    changeTaskTitle: changeTitleCallback,
    removeTask: removeCallback
}
export const TaskIsDoneExample = Template.bind({})
TaskIsDoneExample.args = {
    ...baseArgs,
    task: {
        id: '1',
        title: 'JS',
        status: TaskStatuses.Completed,
        description: '',
        todoListId: 'todoListID_1',
        order: 0,
        priority: TaskPriorities.Hi,
        startDate: '',
        deadline: '',
        addedDate: '',
    },
}
export const TaskIsntDoneExample = Template.bind({})
TaskIsntDoneExample.args = {
    ...baseArgs,
    task: {
        id: '1',
        title: 'JS',
        status: TaskStatuses.New,
        description: '',
        todoListId: 'todoListID_2',
        order: 0,
        priority: TaskPriorities.Hi,
        startDate: '',
        deadline: '',
        addedDate: '',
    },
}
