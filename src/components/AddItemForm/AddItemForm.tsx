import { IconButton, TextField } from "@material-ui/core";
import { ControlPoint } from "@material-ui/icons";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";

export type AddItemFormPropsType = {
    addItem: (title: string) => void;
    disabled?: boolean;
};

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
        if (error !== null) setError(null);
    };
    const onKeyPressAddItem = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addItem();
        }
    };
    const addItem = () => {
        const trimmedTitle = title.trim();
        if (trimmedTitle) {
            props.addItem(trimmedTitle);
        } else {
            setError("Title is required!");
        }
        setTitle("");
    };
    return (
        <div>
            <TextField
                label="Type value"
                variant={"outlined"}
                error={!!error}
                helperText={error}
                value={title}
                onChange={changeTitle}
                onKeyPress={onKeyPressAddItem}
                disabled={props.disabled}
            />
            <IconButton onClick={addItem} disabled={props.disabled}>
                <ControlPoint />
            </IconButton>
            {/*{error && <div className={'errorMessage'}>'Title is required!'</div>} /!*{error}*!/*/}
        </div>
    );
});
