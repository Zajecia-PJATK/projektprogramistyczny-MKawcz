import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/_form_styles.scss';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook do zarządzania nawigacją
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Provided email has an invalid format');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const data = await response.json();
            localStorage.setItem('token', data.token); // Zapisanie tokena
            navigate('/profile');
        } catch (err) {
            setError(err.message);
        }
    }

    const validateEmail = (email) => {
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]+$/;
        return emailRegex.test(email);
    };

    const handleGoToRegistration = () => {
        navigate('/');
    };


    return (
        <div className="centered-container">
            <div className="form-container">
                <img src={require('../filmFolio.png')} alt="FilmFolio Logo" className="logo"/>
                {error && <p className="error">{error}</p>}
                <form noValidate onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </div>
                    <div>
                        <button className="button" type="submit">Log in</button>
                    </div>
                </form>
                <p>Or</p>
                <button className="button" type="submit" onClick={handleGoToRegistration}>Got to Registration</button>
            </div>
        </div>
    );
};

export default LoginForm;