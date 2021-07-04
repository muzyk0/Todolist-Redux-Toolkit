import React from 'react'
import App from './App'
import {BrowserRouterDecorator, ReduxStoreProviderDecorator} from '../stories/decorators/ReduxStoreProviderDecorator'
import {Meta, Story} from '@storybook/react';

export default {
    title: 'Todolist/app',
    component: App,
    argTypes: {},
    decorators: [ReduxStoreProviderDecorator, BrowserRouterDecorator]
} as Meta

const Template: Story = () => <App demo={true}/>

export const AppExample = Template.bind({})
