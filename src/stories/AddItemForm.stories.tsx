import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React from "react";
import {
    AddItemForm,
    AddItemFormPropsType,
} from "../components/AddItemForm/AddItemForm";

export default {
    title: "TodoList/AddItemFormExample",
    component: AddItemForm,
    argTypes: {
        onClick: {
            description: "Button inside form clicked",
        },
    },
} as Meta;

const Template: Story<AddItemFormPropsType> = (args: AddItemFormPropsType) => (
    <AddItemForm {...args} />
);

export const AddItemFormExample = Template.bind({});
AddItemFormExample.args = {
    addItem: action("Button inside form clicked"),
};
