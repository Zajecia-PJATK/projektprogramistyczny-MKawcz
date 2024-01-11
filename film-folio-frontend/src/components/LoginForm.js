import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook do zarządzania nawigacją

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error('Błąd logowania');
            }
            const data = await response.json();
            console.log(data);
            localStorage.setItem('token', data.token); // Zapisanie tokena
            navigate('/profile');
        } catch (error) {
            console.error("Błąd logowania: ", error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
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
                    placeholder="Hasło"
                />
            </div>
            <div>
                <button type="submit">Zaloguj się</button>
            </div>
        </form>
    );
};

export default LoginForm;