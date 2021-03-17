import React, {useState, KeyboardEvent, ChangeEvent} from 'react';
import {TextField} from '@material-ui/core';

type EditableSpan = {
    title: string
    changeTitle: (newTitle: string) => void
}

export function EditableSpan(props: EditableSpan) {

    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')

    const onEditMode = () => {
        setEditMode(true)
        setTitle(props.title)
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
                autoFocus/>
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    )
}