import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/components/_user_profile.scss'
import withAuth from "./withAuth";
import Loader from "./Loader";

const UserPlaylists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if(token) {
                    const decodedToken = jwtDecode(token);
                    const idUser = decodedToken.userId;
                    const response = await fetch(`http://localhost:8080/api/playlists?idUser=${idUser}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch user playlists');
                    }
                    const data = await response.json();
                    setPlaylists(data);
                    setError('');
                    setIsLoading(false);
                }
            } catch (err) {
                setError(err.message);
            }
        };
        fetchPlaylists();
    }, []);

    const handleDelete = async (playlistId) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;
                const response = await fetch(`http://localhost:8080/api/playlists/${playlistId}?idUser=${idUser}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete user playlist');
                }

                setPlaylists(playlists.filter(playlist => playlist.idPlaylist !== playlistId));
                setError('');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <h1>Your Playlists</h1>
            {error && <div className="error">{error}</div>}
            <ul>
                {playlists.map(playlist => (
                    <li key={playlist.idPlaylist}>
                        <Link to={`/playlists/${playlist.idPlaylist}`}>{playlist.name}</Link>
                        <button className="delete-playlist-btn" onClick={() => handleDelete(playlist.idPlaylist)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default withAuth(UserPlaylists);