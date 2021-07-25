import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { TaskStatuses, TodoTaskPriorities } from "../api/todolist-api";
import {
    Task,
    TaskPropsType,
} from "../features/TodoListsList/TodoList/Task/Task";

export default {
    title: "Todolist/Task",
    component: Task,
} as Meta;

const changeTaskStatusCallback = action("Status changed inside Task");
const changeTaskTitleCallback = action("Title changed inside Task");
const removeTaskCallback = action("Remove changed inside Task");

const Template: Story<TaskPropsType> = (args) => <Task {...args} />;

const baseArgs = {
    changeTaskStatus: changeTaskStatusCallback,
    changeTaskTitle: changeTaskTitleCallback,
    removeTask: removeTaskCallback,
};
export const TaskIsDoneExample = Template.bind({});
TaskIsDoneExample.args = {
    ...baseArgs,
    task: {
        id: "1",
        title: "JS",
        status: TaskStatuses.Completed,
        description: "",
        todoListId: "todoListID_1",
        order: 0,
        priority: TodoTaskPriorities.Hi,
        startDate: "",
        deadline: "",
        addedDate: "",
    },
};
export const TaskIsntDoneExample = Template.bind({});
TaskIsntDoneExample.args = {
    ...baseArgs,
    task: {
        id: "1",
        title: "JS",
        status: TaskStatuses.New,
        description: "",
        todoListId: "todoListID_2",
        order: 0,
        priority: TodoTaskPriorities.Hi,
        startDate: "",
        deadline: "",
        addedDate: "",
    },
};
