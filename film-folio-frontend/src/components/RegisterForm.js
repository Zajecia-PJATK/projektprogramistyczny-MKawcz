import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/_form_styles.scss';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Frontend validation
        if (!validateUsername(username)) {
            setError('Field username should be non-empty and max 50 characters long');
            setIsRegistered(false);
            return;
        }

        if (!validateEmail(email)) {
            setError('Provided email has an invalid format');
            setIsRegistered(false);
            return;
        }

        if (!validatePassword(password)) {
            setError('Password should be between 6 and 16 characters long, contain at least 1 number and at least 1 uppercase letter');
            setIsRegistered(false);
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, email, password}),
            });
            if(!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            setIsRegistered(true);

            setUsername('');
            setEmail('');
            setPassword('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const validateUsername = (username) => {
        return username.length > 0 && username.length <= 50;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{6,16}$/;

        return passwordRegex.test(password);
    };

    const handleGoToLogin = () => {
        navigate('/login');
    };


    return (
        <div className="centered-container">
            <div className="form-container">
                <img src={require('../filmFolio.png')} alt="FilmFolio Logo" className="logo"/>
                {error && <p className="error">{error}</p>}
                {isRegistered &&  <p className="success">Rejestracja zakończona sukcesem!</p>}
                <form noValidate onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                    </div>
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
                        <button className="button" type="submit">Register</button>
                    </div>
                </form>
                <p>Or</p>
                <button className="button button-go-to-login" onClick={handleGoToLogin}>Go to login</button>
            </div>
        </div>
    );
};

export default RegisterForm;