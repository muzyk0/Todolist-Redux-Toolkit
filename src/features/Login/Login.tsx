import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    TextField,
} from "@material-ui/core";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as yup from "yup";
import { AppRootStateType } from "../../app/store";
import { login } from "./auth-sagas";

const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email address").required("Required"),
    password: yup.string().min(2).required("Required"),
    rememberMe: yup.boolean(),
});

export const Login = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(
        (state) => state.auth.isLoggedIn
    );
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            dispatch(login(values));
            formik.resetForm();
        },
    });

    if (isLoggedIn) {
        return <Redirect to={"/"} />;
    }

    return (
        <Grid container justifyContent="center">
            <Grid item xs={4}>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel>
                            <p>
                                To log in get registered
                                <a
                                    href={
                                        "https://social-network.samuraijs.com/"
                                    }
                                    target={"_blank"}
                                    rel="noreferrer"
                                >
                                    here
                                </a>
                            </p>
                            <p>or use common test account credentials:</p>
                            <p>Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </FormLabel>
                        <FormGroup>
                            <TextField
                                label="Email"
                                margin="normal"
                                {...formik.getFieldProps("email")}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div style={{ color: "red" }}>
                                    {formik.errors.email}
                                </div>
                            )}

                            <TextField
                                type="password"
                                label="Password"
                                margin="normal"
                                {...formik.getFieldProps("password")}
                            />
                            {formik.touched.password &&
                                formik.errors.password && (
                                    <div style={{ color: "red" }}>
                                        {formik.errors.password}
                                    </div>
                                )}

                            <FormControlLabel
                                label={"Remember me"}
                                control={
                                    <Checkbox
                                        {...formik.getFieldProps("rememberMe")}
                                    />
                                }
                            />
                            <Button
                                type={"submit"}
                                variant={"contained"}
                                color={"primary"}
                            >
                                Login
                            </Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    );
};
