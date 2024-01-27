import React, { useState, useEffect } from 'react';
import { useParams, Link} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "../styles/components/_playlist_details.scss";
import withAuth from "./withAuth";
import Loader from "./Loader";

const PlaylistDetails = () => {
    const [playlist, setPlaylist] = useState(null);
    const [editablePlaylist, setEditablePlaylist] = useState({ name: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const { playlistId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const baseURL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            setIsLoading(true);
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
                        throw new Error('Failed to fetch playlist details');
                    }

                    const data = await response.json();
                    setPlaylist(data);
                    setEditablePlaylist({ name: data.name, description: data.description });
                    setError('');
                    setIsLoading(false);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPlaylistDetails();
    }, [playlistId]);

    const validateName = (name) => {
        return name.length > 0 && name.length <= 50;
    };

    const validateDescription = (description) => {
        return description.length > 0 && description.length <= 1000;
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUpdateChange = (e) => {
        setEditablePlaylist({ ...editablePlaylist, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        if (!validateName(editablePlaylist.name)) {
            setError('Playlist name cannot be blank and should be max 50 characters long');
            return;
        }

        if (!validateDescription(editablePlaylist.description)) {
            setError('Playlist description cannot be blank and should be max 1000 characters long');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;
                const updateResponse = await fetch(`http://localhost:8080/api/playlists/${playlistId}?idUser=${idUser}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(editablePlaylist)
                });

                if (!updateResponse.ok) {
                    const errorData = await updateResponse.json();
                    throw new Error(errorData.message || 'Failed to update playlist');
                }

                // Ponowne pobranie pełnych danych playlisty po aktualizacji
                const fetchResponse = await fetch(`http://localhost:8080/api/playlists/${playlistId}?idUser=${idUser}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!fetchResponse.ok) {
                    throw new Error('Failed to fetch updated playlist');
                }

                const updatedPlaylistData = await fetchResponse.json();
                setPlaylist(updatedPlaylistData);
                setIsEditing(false);
                setError('');
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
                    throw new Error('Failed to delete movie from playlist');
                }

                const updatedMovies = playlist.movies.filter(movie => movie.id !== tmdbIdMovie);
                setPlaylist({ ...playlist, movies: updatedMovies });
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
        <div className="playlist-details-container">
            {error && <div className="error">{error}</div>}
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
                    <button className="button" type="submit">Zapisz zmiany</button>
                </form>
            ) : (
                <>
                    <div className="header">
                        <div>
                            <h1>{playlist.name}</h1>
                            <p>{playlist.description}</p>
                        </div>
                        <button className="edit-btn" onClick={handleEditClick}>Edit</button>
                    </div>
                </>
            )}
            <div className="movies-container">
                {playlist.movies.map(movie => (
                    <div key={movie.id} className="movie-item">
                        <Link to={`/movies/${movie.id}`}>
                            <img
                                src={movie.poster_path ? `${baseURL}${movie.poster_path}` : require('../No_image_poster.png')}
                                alt={`Poster of ${movie.title}`}
                            />
                        </Link>
                        <Link to={`/movies/${movie.id}`}>
                            <p>{movie.title} ({movie.release_date.slice(0, 4)})</p>
                        </Link>
                        <button className="delete-btn" onClick={() => handleDeleteMovie(movie.id)}>X</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default withAuth(PlaylistDetails);
