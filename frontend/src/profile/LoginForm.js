import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Typography } from '@mui/material';
import Alert from "../utilities/Alert";
import Loading from "../utilities/Loading";
import * as Yup from 'yup';
import "./FormContainer.css"
import { faL } from '@fortawesome/free-solid-svg-icons';

/**
 * LoginForm Component
 * Displays form and renders controlled components functionality
 * Provides form validation with formik
 * 
 * A form component for user login. Handles user input for username, password.
 * Displays form errors if registration fails.
 * On submission:
 * - calls login function prop
 * - redirects to / route
 *
 * Routes ==> LoginForm ==> Alert 
 */
const LoginForm = ({ login }) => {
    console.debug("LoginForm");

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)

    /**
     * Handles form submission. Calls the login function with the form data.
     * Redirects to the home page upon successful registration, or displays form errors.
     */
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setLoading(true);
            const result = await login(values);
    
            if (result.success) {
                navigate("/");
                setLoading(false)
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError("An error occurred during login. Please try again...");
            setLoading(false)
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Typography variant="h2" sx={{  marginBottom: 2 }}>Login</Typography>
            {error ? <Alert type="danger" messages={[error]} />: null}
            <Formik
                initialValues={{ username: '', password: ''}}
                validationSchema={Yup.object({
                    username: Yup.string()
                    .max(15, 'Must be 15 characters or less')
                    .required('Username Required'),
                    password: Yup.string()
                    .max(20, 'Must be 20 characters or less')
                    .required('Password Required'),
                })}
                onSubmit={handleSubmit} 
                >
                <Form className='FormContainer'>
                    <div>
                        <label htmlFor="username">Username</label>
                        <Field id="username" name="username" type="text" placeholder="Username"/>
                        <span className='ErrorMessageContainer'><ErrorMessage name="username"/></span>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <Field id="password" label="password" name="password" type="password" placeholder="Password" />
                        <span className='ErrorMessageContainer'><ErrorMessage name="password" /></span>
                    </div>      

                    <button type="submit">Submit</button>
                    {loading && <Loading />}
                </Form>
            </Formik>
            <Link to={`/signup`} data-testid="user-signup-link">
                <p>Don't have an account?</p>
            </Link>
        </div>
    );
};

export default LoginForm;