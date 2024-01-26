import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Typography } from '@mui/material';
import Alert from "../utilities/Alert";
import Loading from "../utilities/Loading";
import * as Yup from 'yup';
import "./FormContainer.css"

/**
 * SignUpForm Component
 * Displays form and renders controlled components functionality
 * Provides form validation with formik
 * 
 * A form component for user registration. Handles user input for username, password, first name, last name, email and user image.
 * Displays form errors if registration fails.
 * On submission:
 * - calls signup function prop
 * - redirects to / route
 *
 * Routes ==> SignupForm ==> Alert
 */
const SignupForm = ({ signup }) => {
    console.debug("SignupForm");

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)

    /**
     * Handles form submission. Calls the signup function with the form data.
     * Redirects to the home page upon successful registration, or displays form errors.
     */
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setLoading(true);
            const result = await signup(values);
    
            if (result.success) {
                navigate("/");
                setLoading(false)
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError("Please use another username. This username is taken. ");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Typography variant="h2" sx={{  marginBottom: 2 }}>Sign Up</Typography>
            {error ? <Alert type="danger" messages={[error]} />: null}
            <Formik
                initialValues={{ username: '', password: '', email: '', img: '' }}
                validationSchema={Yup.object({
                    username: Yup.string()
                    .max(35, 'Must be 35 characters or less')
                    .required('Username is required'),
                    password: Yup.string()
                    .max(20, 'Must be 20 characters or less')
                    .required('Password is required'),
                    email: Yup.string()
                    .email('Invalid email address')
                    .required('Email is required'),
                    img: Yup.string().notRequired(),
                })}
                onSubmit={handleSubmit}
                >
                <Form className='FormContainer'>
                    <div>
                        <label htmlFor="username">Username</label>
                        <Field id="username" name="username" type="text" placeholder="Username" />
                        <span className='ErrorMessageContainer'><ErrorMessage name="username"/></span>
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <Field id="password" name="password" type="password" placeholder="Password" />
                        <span className='ErrorMessageContainer'><ErrorMessage name="password" /></span>
                    </div>

                    <div>
                        <label htmlFor="email">Email Address</label>
                        <Field id="email" name="email" type="email" placeholder="Email" />
                        <span className='ErrorMessageContainer'><ErrorMessage name="email" /></span>
                    </div>

                    <div>
                        <label htmlFor="img">Profile Image URL (optional)</label>
                        <Field id="img" name="img" type="text" placeholder="Profile Image URL (optional)"/>
                        <span className='ErrorMessageContainer'><ErrorMessage name="img" /></span>
                    </div>

                    {/* <div>
                        <label htmlFor="userImg">Profile Image</label>
                        <Field name="userImg" type="file" encType="multipart/form-data"/>
                        <input type="file" name="userImg" encType="multipart/form-data"/>
                        <span className='ErrorMessageContainer'><ErrorMessage name="profileImage" /></span>
                    </div> */}

                    <button type="submit">Submit</button>
                    {loading && <Loading style={{ color:"orangered" }} />}                
                </Form>
            </Formik>
            <Link to={`/login`} data-testid="user-login-link">
                <p>Login instead?</p>
            </Link>
        </div>
    );
};

export default SignupForm;
