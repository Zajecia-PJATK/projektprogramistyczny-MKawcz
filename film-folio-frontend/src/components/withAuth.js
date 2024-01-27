import React from 'react';
import { Navigate } from 'react-router-dom';

function withAuth(Component) {
    return (props) => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Przekierowanie do strony logowania
            return <Navigate to="/login" />;
        }

        // Jeśli token istnieje, wyrenderuj komponent
        return <Component {...props} />;
    };
}

export default withAuth;
