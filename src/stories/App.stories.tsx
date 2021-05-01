import {Meta, Story} from '@storybook/react';
import App from '../App';
import {ReduxStoreProviderDecorator} from './decorators/ReduxStoreProviderDecorator';

export default {
  title: 'Todolist/App',
  component: App,
  argTypes: {},
  decorators: [ReduxStoreProviderDecorator]
} as Meta

const Template: Story = () => <App/>

export const AppExample = Template.bind({})
