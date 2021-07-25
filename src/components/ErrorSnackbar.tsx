import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAppError } from "../app/app-reducer";
import { AppRootStateType } from "../app/store";

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function ErrorSnackbar() {
    const error = useSelector<AppRootStateType, string | null>(
        (state) => state.app.error
    );
    const dispatch = useDispatch();

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        dispatch(setAppError(null));
    };

    return (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
                {error}
            </Alert>
        </Snackbar>
    );
}
