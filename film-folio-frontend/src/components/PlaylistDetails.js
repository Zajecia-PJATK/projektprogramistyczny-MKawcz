import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PlaylistDetails = () => {
    const [playlist, setPlaylist] = useState(null);
    const [editablePlaylist, setEditablePlaylist] = useState({ name: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const { playlistId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const idUser = decodedToken.userId;
                    const response = await fetch(`http://localhost:8080/api/playlists/${playlistId}?idUser=${idUser}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Nie udało się pobrać szczegółów playlisty');
                    }

                    const data = await response.json();
                    setPlaylist(data);
                    setEditablePlaylist({ name: data.name, description: data.description });
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPlaylistDetails();
    }, [playlistId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUpdateChange = (e) => {
        setEditablePlaylist({ ...editablePlaylist, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;
                const response = await fetch(`http://localhost:8080/api/playlists/${playlistId}?idUser=${idUser}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(editablePlaylist)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Błąd aktualizacji playlisty');
                }

                const updatedPlaylist = await response.json();
                setPlaylist(updatedPlaylist);
                setIsEditing(false);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteMovie = async (tmdbIdMovie) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;
                const response = await fetch(`http://localhost:8080/api/playlists/${playlistId}/${tmdbIdMovie}?idUser=${idUser}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Błąd usuwania filmu z playlisty');
                }

                const updatedMovies = playlist.movies.filter(movie => movie.id !== tmdbIdMovie);
                setPlaylist({ ...playlist, movies: updatedMovies });
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    if (!playlist) {
        return <div>Ładowanie...</div>;
    }

    return (
        <div>
            {isEditing ? (
                <form onSubmit={handleUpdateSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={editablePlaylist.name}
                        onChange={handleUpdateChange}
                    />
                    <textarea
                        name="description"
                        value={editablePlaylist.description}
                        onChange={handleUpdateChange}
                    />
                    <button type="submit">Zapisz zmiany</button>
                </form>
            ) : (
                <>
                    <h1>{playlist.name}</h1>
                    <p>{playlist.description}</p>
                    <button onClick={handleEditClick}>Edytuj</button>
                    {playlist.movies.map(movie => (
                        <div key={movie.id}>
                            <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
                            <button onClick={() => handleDeleteMovie(movie.id)}>Usuń</button>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default PlaylistDetails;
