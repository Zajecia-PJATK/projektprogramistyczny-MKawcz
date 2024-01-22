import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const UserPlaylists = () => {
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlaylists = async () => {
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
                        throw new Error('Nie udało się pobrać playlist');
                    }
                    const data = await response.json();
                    setPlaylists(data);
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
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Błąd usuwania playlisty');
                }

                setPlaylists(playlists.filter(playlist => playlist.idPlaylist !== playlistId));
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div>
            <h1>Twoje playlisty</h1>
            <ul>
                {playlists.map(playlist => (
                    <li key={playlist.idPlaylist}>
                        <Link to={`/playlists/${playlist.idPlaylist}`}>{playlist.name}</Link>
                        <button onClick={() => handleDelete(playlist.idPlaylist)}>Usuń</button>
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default UserPlaylists;