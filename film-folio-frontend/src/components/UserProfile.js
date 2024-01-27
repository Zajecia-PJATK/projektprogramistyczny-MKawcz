import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import UserPlaylists from './UserPlaylists';
import { Link } from 'react-router-dom';
import UserWatchlist from "./UserWatchlist";
import GenrePreferences from "./GenrePreferences";
import '../styles/components/_user_profile.scss'
import Recommendations from "./Recommendations";
import withAuth from "./withAuth";
import Loader from "./Loader";

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
    const [isAdmin, setIsAdmin] = useState(false);
    const [preferences, setPreferences] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const idUser = decodedToken.userId;
            setIsAdmin(decodedToken.role.toString() === 'ROLE_ADMIN');

            // Pobieranie informacji o użytkowniku
            const fetchUserInfo = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`http://localhost:8080/api/users/profile?idUser=${idUser}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    const data = await response.json();
                    setUserInfo({
                        username: data.username,
                        email: data.email
                    });

                    setError('');
                    setIsLoading(false);
                } catch (err) {
                    setError(err.message);
                }
            };

            // Pobieranie statystyk użytkownika
            const fetchUserStats = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`http://localhost:8080/api/users/${idUser}/stats`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    const stats = await response.json();
                    setUserStats({
                        watchedMoviesCount: stats.watchedMoviesCount,
                        totalWatchTime: stats.totalWatchTime,
                        monthlyWatchStats: stats.monthlyWatchStats
                    });
                    setError('');
                    setIsLoading(false);
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

        if (!validateUsername(userInfo.username)) {
            setError('Field username should be non-empty and max 50 characters long');
            return;
        }

        if (!validateEmail(userInfo.email)) {
            setError('Provided email has an invalid format');
            return;
        }

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
                    throw new Error(errorData.message || 'Failed to update user data');
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
                setError('');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const updatePreferences = (newPreferences) => {
        setPreferences(newPreferences);
    };

    const validateUsername = (username) => {
        return username.length > 0 && username.length <= 50;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]+$/;
        return emailRegex.test(email);
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="user-profile-container">
            <div className="sidebar">
                <UserPlaylists/>
                <Link to="/create-playlist" className="create-playlist-link">Create New Playlist</Link>
            </div>
            <div className="content">
                <div className="header">
                    <h1>Hello, {userInfo.username}!</h1>
                    <button className="button edit-profile-btn" onClick={handleEditClick}>Edit Profile</button>
                    {isAdmin && (
                        <Link to="/admin/users">Zarządzaj Użytkownikami</Link>
                    )}
                </div>
                {error && <div className="error">{error}</div>}
                {isEditing ? (
                    <form onSubmit={handleUpdateSubmit} className="edit-form">
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
                        <button className="button" type="submit">Save Changes</button>
                        <GenrePreferences updatePreferences={updatePreferences}/>
                    </form>
                ) : (
                    <>
                        <div>
                            <p>{userInfo.email}</p>
                        </div>
                    </>
                )}
                <div className="stats-section">
                    <table>
                        <thead>
                        <tr>
                            <th>Total Movies Watched</th>
                            {Object.keys(userStats.monthlyWatchStats)
                                .slice(-12) // Pobiera ostatnie 12 miesięcy
                                .map(month => <th key={month}>{month}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{userStats.watchedMoviesCount}</td>
                            {Object.values(userStats.monthlyWatchStats)
                                .slice(-12) // Pobiera dane dla ostatnich 12 miesięcy
                                .map((count, index) => <td key={index}>{count}</td>)}
                        </tr>
                        <tr>
                            <td colSpan={Object.keys(userStats.monthlyWatchStats).length + 1}>
                                {userStats.totalWatchTime} minutes
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <UserWatchlist/>
                <Recommendations/>
            </div>
        </div>
    );
};

export default withAuth(UserProfile);