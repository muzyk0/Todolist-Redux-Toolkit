import {TasksType} from './AppOld';
import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from '@material-ui/core';
import {EditableSpan} from './EditableSpan';
import {Delete} from '@material-ui/icons';

type TaskType = {
    task: TasksType
    removeTask: (taskID: string) => void
    changeTaskStatus: (taskID: string, newIsDoneValue: boolean) => void
    changeTaskTitle: (taskID: string, newTitle: string) => void
}
export const Task: React.FC<TaskType> = React.memo((props) => {

    const {
        task,
        removeTask,
        changeTaskStatus,
        changeTaskTitle
    } = props

    const onClickHandler = () => {
        removeTask(task.id)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(task.id, e.currentTarget.checked)
    }
    const onTitleChangeHandler = useCallback((newTitle: string) => {
        changeTaskTitle(task.id, newTitle)
    }, [task.id])

    return (
        <li style={task.isDone ? {opacity: '0.5'} : {opacity: 1}}>
            <Checkbox
                checked={task.isDone}
                onChange={onChangeHandler}
            />
            <EditableSpan title={task.title} changeTitle={onTitleChangeHandler}/>
            <IconButton onClick={onClickHandler}>
                <Delete/>
            </IconButton>
        </li>
    )
})