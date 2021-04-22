import {Meta, Story} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {Task, TaskType} from '../Task';
import {EditableSpan} from '../EditableSpan';

export default {
    title: 'Todolist/EditableSpan',
    component: EditableSpan,
    argTypes: {
        changeTitle: {
            description: 'Value EditableSpan changed'
        },
        title: {
            defaultValue: 'HTML',
            description: 'Start value EditableSpan',
        }
    }
} as Meta

const Template: Story<EditableSpan> = (args) => <EditableSpan {...args}/>


export const EditableSpanExample = Template.bind({})
EditableSpanExample.args = {
    changeTitle: action('Value EditableSpan changed')
}