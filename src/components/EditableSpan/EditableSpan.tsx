import React, {useState} from 'react';
import {TextField} from '@material-ui/core';

export type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string) => void
}

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {
    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.value);

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.value);
    }
    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    }
    const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setEditMode(false)
            props.onChange(title)
        }
    }

    return editMode
        ? <TextField
            color={'secondary'}
            value={title}
            onChange={changeTitle}
            autoFocus onBlur={activateViewMode}
            onKeyPress={onEnter}
        />
        : <span onDoubleClick={activateEditMode}>{props.value}</span>
});
