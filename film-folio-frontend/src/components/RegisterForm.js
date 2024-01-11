import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
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
                throw new Error(errorData.message || 'Błąd rejestracji');
            }
            setIsRegistered(true);
            // const data = await response.json();
            // console.log(data);
            // Przekierowanie lub zapisanie tokena JWT
        } catch (error) {
            setErrorMessage(error.toString());
        }
    };

    const handleGoToLogin = () => {
        navigate('/login');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nazwa użytkownika"
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
                        placeholder="Hasło"
                    />
                </div>
                <div>
                    <button type="submit">Zarejestruj się</button>
                </div>
            </form>
            {isRegistered && <p>Rejestracja zakończona sukcesem!</p>}
            {errorMessage && <p>{errorMessage}</p>}
            <button onClick={handleGoToLogin}>Przejdź do logowania</button>
        </div>
    );
};

export default RegisterForm;