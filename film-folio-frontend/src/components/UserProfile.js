import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import UserPlaylists from './UserPlaylists';
import { Link } from 'react-router-dom';
import UserWatchlist from "./UserWatchlist";
import GenrePreferences from "./GenrePreferences";
import Recommendations from "./Recommendations";

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: ''
    });
    const [userStats, setUserStats] = useState({
        watchedMoviesCount: 0,
        totalWatchTime: 0,
        monthlyWatchStats: {}
    });
    const [isEditing, setIsEditing] = useState(false);
    const [preferences, setPreferences] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const idUser = decodedToken.userId;

            // Pobieranie informacji o użytkowniku
            const fetchUserInfo = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/users/profile?idUser=${idUser}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) {
                        throw new Error('Nie udało się pobrać danych profilu');
                    }
                    const data = await response.json();
                    setUserInfo({
                        username: data.username,
                        email: data.email
                    });
                } catch (err) {
                    setError(err.message);
                }
            };

            // Pobieranie statystyk użytkownika
            const fetchUserStats = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/users/${idUser}/stats`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) {
                        throw new Error('Nie udało się pobrać statystyk użytkownika');
                    }
                    const stats = await response.json();
                    setUserStats({
                        watchedMoviesCount: stats.watchedMoviesCount,
                        totalWatchTime: stats.totalWatchTime,
                        monthlyWatchStats: stats.monthlyWatchStats
                    });
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchUserInfo();
            fetchUserStats();
        }
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
                setUserInfo(userInfo => ({
                    ...userInfo,
                    username: updatedData.username,
                    email: updatedData.email
                }));

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

    const updatePreferences = (newPreferences) => {
        setPreferences(newPreferences);
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
                    <GenrePreferences updatePreferences={updatePreferences} />
                </form>
            ):(
                <>
                    <div>
                        <p>Nazwa użytkownika: {userInfo.username}</p>
                        <p>Email: {userInfo.email}</p>
                        <button onClick={handleEditClick}>Edytuj profil</button>
                        <Link to="/create-playlist">Stwórz nową playlistę</Link>
                    </div>
                    <div>
                        <h3>Statystki</h3>
                        {userStats.monthlyWatchStats && (
                            <ul>
                                {Object.entries(userStats.monthlyWatchStats).map(([month, count]) => (
                                    <li key={month}>{month}: Łącznie obejrzanych filmów: {count} </li>
                                ))}
                            </ul>
                        )}
                        <p>Łącznie obejrzanych filmów: {userStats.watchedMoviesCount}</p>
                        <p>Łącznie minut spędzonych na oglądanie: {userStats.totalWatchTime}</p>
                    </div>
                </>
            )}
            <UserWatchlist />
            <UserPlaylists />
            <Recommendations />
        </div>
    );
};

export default UserProfile;