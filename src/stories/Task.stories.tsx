import {Meta, Story} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import {Task, TaskType} from '../Task';

export default {
  title: 'Todolist/Task',
  component: Task
} as Meta

const changeTaskStatusCallback = action('Status changed inside Task')
const changeTaskTitleCallback = action('Title changed inside Task')
const removeTaskCallback = action('Remove changed inside Task')

const Template: Story<TaskType> = (args) => <Task {...args}/>

const baseArgs = {
  changeTaskStatus: changeTaskStatusCallback,
  changeTaskTitle: changeTaskTitleCallback,
  removeTask: removeTaskCallback
}
export const TaskIsDoneExample = Template.bind({})
TaskIsDoneExample.args = {
  ...baseArgs,
  task: {id: '1', title: 'JS', isDone: true},
}
export const TaskIsntDoneExample = Template.bind({})
TaskIsntDoneExample.args = {
  ...baseArgs,
  task: {id: '1', title: 'JS', isDone: false},
}
