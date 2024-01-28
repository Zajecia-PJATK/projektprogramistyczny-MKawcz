import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import '../styles/components/_form_styles.scss';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .matches(/^[\w-.]+@([\w-]+\.)+[\w-]+$/, 'Provided email has an invalid format')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
});

const LoginForm = () => {
    const navigate = useNavigate();

    const handleGoToRegistration = () => {
        navigate('/');
    };

    return (
        <div className="centered-container">
            <div className="form-container">
                <img src={require('../filmFolio.png')} alt="FilmFolio Logo" className="logo"/>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, { setSubmitting, setStatus }) => {
                        try {
                            const response = await fetch('http://localhost:8080/api/users/login', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(values),
                            });

                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message);
                            }

                            const data = await response.json();
                            localStorage.setItem('token', data.token);
                            navigate('/profile');
                        } catch (err) {
                            setStatus({ error: err.message });
                        }

                        setSubmitting(false);
                    }}
                >
                    {({ errors, touched, status }) => (
                        <Form noValidate>
                            {status && status.error && <p className="error">{status.error}</p>}
                            <div>
                                <Field type="email" name="email" placeholder="Email" />
                                {errors.email && touched.email ? (<div className="error">{errors.email}</div>) : null}
                            </div>
                            <div>
                                <Field type="password" name="password" placeholder="Password" />
                                {errors.password && touched.password ? (<div className="error">{errors.password}</div>) : null}
                            </div>
                            <div>
                                <button className="button" type="submit">Log in</button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <p>Or</p>
                <button className="button" onClick={handleGoToRegistration}>Go to Registration</button>
            </div>
        </div>
    );
};

export default LoginForm;
