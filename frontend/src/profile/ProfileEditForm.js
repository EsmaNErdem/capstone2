import React, { useState } from 'react';
import BookClubApi from '../api';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Alert from "../utilities/Alert"
import * as Yup from 'yup';
import "./FormContainer.css"

/**ProfileEditForm Component
 * Displays a form with and rendered controlled component functionality and uses modal functionality
 * 
 * * A form component for user profile update. Handles user input for, first name, last name, email and user image while username constant.
 * Displays form errors if registration fails.
 * On submission:
 * - calls API to user info
 * - update currentUser state
 * - shows conformation message when update is successful
 *
 * Routes ==> ProfileForm ==> Alert
 */
const ProfileEditForm = ({ close=false, closeModal, initialValues, updateUser }) => {
    console.debug("ProfileEditForm");

    const [error, setError] = useState(null);

    /**
     * Handles form submission. Calls the signup function with the form data.
     * Redirects to the home page upon successful registration, or displays form errors.
     */
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const updatedUser =  await BookClubApi.updateUser(initialValues.username, values)
            updateUser(user => ({
                ...user,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                img: updatedUser.img,
                email: updatedUser.email,
            }))
            if (close) closeModal();
        } catch (error) {
            setError("An error occurred during edit.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='ProfileEditForm'>
            <Formik
                initialValues={{ firstName: initialValues.firstName, lastName: initialValues.lastName, email: initialValues.email, img: initialValues.img }}
                validationSchema={Yup.object({
                    password: Yup.string()
                        .notRequired(),
                    firstName: Yup.string()
                        .max(15, 'Must be 15 characters or less')
                        .notRequired(),
                    lastName: Yup.string()
                        .max(20, 'Must be 20 characters or less')
                        .notRequired(),
                    email: Yup.string()
                    .email('Invalid email address')
                    .notRequired(),
                    img: Yup.string().notRequired(),
                })}
                onSubmit={handleSubmit}
                >
                <Form className='FormContainer'>
                    <IconButton onClick={closeModal} sx={{ width: "20px"}}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h2" sx={{  marginBottom: 2 }}>Edit User</Typography>
                    {error ? <Alert type="danger" messages={[error]} />: null}
                    <div>
                        <label htmlFor="password">Password</label>
                        <Field id="password" name="password" type="password" placeholder="Password" />
                        <span className='ErrorMessageContainer'><ErrorMessage name="password" /></span>
                    </div>

                    <div>
                        <label htmlFor="firstName">First Name</label>
                        <Field id="firstName" name="firstName" type="text" placeholder="First Name" />
                        <span className='ErrorMessageContainer'><ErrorMessage name="firstName" /></span>
                    </div>

                    <div>
                        <label htmlFor="lastName">Last Name</label>
                        <Field id="lastName" name="lastName" type="text" placeholder="Last Name" />
                        <span className='ErrorMessageContainer'><ErrorMessage name="lastName" /></span>
                    </div>

                    <div>
                        <label htmlFor="email">Email Address</label>
                        <Field id="email" name="email" type="email" placeholder="Email" />
                        <span className='ErrorMessageContainer'><ErrorMessage name="email" /></span>
                    </div>

                    <div>
                        <label htmlFor="img">Profile Image URL</label>
                        <Field id="img" name="img" type="text" placeholder="Profile Image URL"/>
                        <span className='ErrorMessageContainer'><ErrorMessage name="img" /></span>
                    </div>

                    <button type="submit">Save Changes</button>
                </Form>
            </Formik>
        </div>
    );
};

export default ProfileEditForm;