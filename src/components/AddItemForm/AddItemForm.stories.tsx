import React from 'react'
import {action} from '@storybook/addon-actions'
import {AddItemForm, AddItemFormPropsType} from './AddItemForm'
import {Meta, Story} from '@storybook/react';

export default {
    title: 'TodoList/AddItemFormExample',
    component: AddItemForm,
    argTypes: {
        onClick: {
            description:  'Button inside form clicked' ,
        },}

} as Meta;

const Template: Story<AddItemFormPropsType> = (args:AddItemFormPropsType) => <AddItemForm {...args} />;

export const AddItemFormExample = Template.bind({});
AddItemFormExample.args = {
    addItem: action('Button inside form clicked')
};