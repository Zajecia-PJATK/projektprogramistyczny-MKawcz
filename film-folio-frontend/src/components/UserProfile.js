import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
const UserProfile = () => {
    const [userInfo, setUserInfo] = useState({ username: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const idUser = decodedToken.userId;
                    const response = await fetch(`http://localhost:8080/api/users/profile?idUser=${idUser}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Nie udało się pobrać danych profilu');
                    }

                    const data = await response.json();
                    setUserInfo({ username: data.username, email: data.email });
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserInfo();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if(token) {
                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;
                const response = await fetch(`http://localhost:8080/api/users/profile?idUser=${idUser}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        username: userInfo.username,
                        email: userInfo.email
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Błąd aktualizacji profilu');
                }

                const updatedData = await response.json();
                setUserInfo({ username: updatedData.username, email: updatedData.email });

                // Aktualizacja tokenu w localStorage
                if (updatedData.token) {
                    localStorage.setItem('token', updatedData.token);
                }

                setIsEditing(false);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    if (!userInfo) {
        return <div>Ładowanie danych profilu...</div>;
    }

    return (
        <div>
            <h1>Twój Profil</h1>
            {isEditing ? (
                <form onSubmit={handleUpdateSubmit}>
                    <input
                        type="text"
                        value={userInfo.username}
                        onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                    />
                    <input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    />
                    <button type="submit">Zapisz zmiany</button>
                </form>
            ):(
                <>
                    <p>Nazwa użytkownika: {userInfo.username}</p>
                    <p>Email: {userInfo.email}</p>
                    <button onClick={handleEditClick}>Edytuj profil</button>
                </>
            )}
        </div>
    );
};

export default UserProfile;