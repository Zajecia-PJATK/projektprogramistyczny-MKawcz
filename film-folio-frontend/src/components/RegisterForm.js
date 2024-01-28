import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import '../styles/components/_form_styles.scss';

const RegisterSchema = Yup.object().shape({
    username: Yup.string()
        .min(1, 'Username is too short')
        .max(50, 'Username is too long')
        .required('Username is required'),
    email: Yup.string()
        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]+$/, 'Provided email has an invalid format')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .max(16, 'Password must not exceed 16 characters')
        .matches(/^(?=.*\d)(?=.*[A-Z]).*$/, 'Password must contain at least 1 number and 1 uppercase letter')
        .required('Password is required'),
    role: Yup.string()
        .oneOf(['ROLE_USER', 'ROLE_ADMIN'], 'Invalid role')
        .required('Role is required'),
});

const RegisterForm = () => {
    const navigate = useNavigate();

    const handleGoToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="centered-container">
            <div className="form-container">
                <img src={require('../filmFolio.png')} alt="FilmFolio Logo" className="logo"/>
                <Formik
                    initialValues={{ username: '', email: '', password: '', role: 'ROLE_USER' }}
                    validationSchema={RegisterSchema}
                    onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
                        try {
                            const response = await fetch('http://localhost:8080/api/users/register', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(values),
                            });

                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message);
                            }

                            alert('Successfully registered!');
                            setStatus({ successMessage: 'Successfully registered!' });
                            resetForm();
                        } catch (err) {
                            setStatus({ error: err.message });
                        }
                        setSubmitting(false);
                    }}
                >
                    {({ errors, touched, status }) => (
                        <Form noValidate>
                            {status && status.error && <p className="error">{status.error}</p>}
                            {status && status.successMessage && <p className="success">{status.successMessage}</p>}
                            <div>
                                <Field type="text" name="username" placeholder="Username" />
                                {errors.username && touched.username ? (<div className="error">{errors.username}</div>) : null}
                            </div>
                            <div>
                                <Field type="email" name="email" placeholder="Email" />
                                {errors.email && touched.email ? (<div className="error">{errors.email}</div>) : null}
                            </div>
                            <div>
                                <Field type="password" name="password" placeholder="Password" />
                                {errors.password && touched.password ? (<div className="error">{errors.password}</div>) : null}
                            </div>
                            <div>
                                <label htmlFor="selectRole">Select Role:</label>
                                <Field as="select" name="role" id="selectRole">
                                    <option value="ROLE_USER">USER</option>
                                    <option value="ROLE_ADMIN">ADMIN</option>
                                </Field>
                            </div>
                            <div>
                                <button className="button" type="submit">Register</button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <p>Or</p>
                <button className="button button-go-to-login" onClick={handleGoToLogin}>Go to login</button>
            </div>
        </div>
    );
};

export default RegisterForm;
