import React, {useState, KeyboardEvent, ChangeEvent} from 'react';
import {TextField} from '@material-ui/core';

export type EditableSpan = {
    title: string
    changeTitle: (newTitle: string) => void
    disabled?: boolean
}

export const EditableSpan: React.FC<EditableSpan> = React.memo((props) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')

    const onEditMode = () => {
        if (!props.disabled) {
            setEditMode(true)
            setTitle(props.title)
        }
    }
    const offEditMode = () => {
        setEditMode(false)
        props.changeTitle(title)
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setEditMode(false)
            props.changeTitle(title)
        }
    }

    return (
        editMode
            ? <TextField
                color={'secondary'}
                value={title}
                onChange={changeTitle}
                onBlur={offEditMode}
                onKeyPress={onEnter}
                autoFocus
            />
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    )
})