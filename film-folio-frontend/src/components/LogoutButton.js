import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Usuwa token z localStorage
        localStorage.removeItem('token');

        // Przekierowuje do strony logowania
        navigate('/');
    };

    return (
        <button className="button" onClick={handleLogout}>
            Log out
        </button>
    );
};

export default LogoutButton;