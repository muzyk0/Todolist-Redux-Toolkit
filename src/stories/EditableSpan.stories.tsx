import {Meta, Story} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {EditableSpan, EditableSpanProps} from '../components/EdditableSpan/EditableSpan';

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

const Template: Story<EditableSpanProps> = (args) => <EditableSpan {...args}/>


export const EditableSpanExample = Template.bind({})
EditableSpanExample.args = {
    changeTitle: action('Value EditableSpan changed')
}