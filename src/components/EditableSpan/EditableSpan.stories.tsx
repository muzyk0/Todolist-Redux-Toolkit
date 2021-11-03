import { action } from '@storybook/addon-actions'
import { EditableSpan, EditableSpanPropsType } from './EditableSpan'
import { Meta, Story } from '@storybook/react'

export default {
    title: 'Todolist/EditableSpan',
    component: EditableSpan,
    argTypes: {
        onChange: {
            description: 'Value EditableSpan changed',
        },
        title: {
            defaultValue: 'HTML',
            description: 'Start value EditableSpan',
        },
    },
} as Meta

const Template: Story<EditableSpanPropsType> = (args) => (
    <EditableSpan {...args} />
)

export const EditableSpanExample = Template.bind({})
EditableSpanExample.args = {
    onChange: action('Value EditableSpan changed'),
}
