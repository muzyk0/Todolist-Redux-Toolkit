import {Meta, Story} from '@storybook/react';
import App from '../app/App';
import {BrowserRouterDecorator, ReduxStoreProviderDecorator} from './decorators/ReduxStoreProviderDecorator';

export default {
  title: 'Todolist/app',
  component: App,
  argTypes: {},
  decorators: [ReduxStoreProviderDecorator, BrowserRouterDecorator]
} as Meta

const Template: Story = () => <App demo={true}/>

export const AppExample = Template.bind({})
