import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "../styles/components/_create_playlist.scss"
import withAuth from "./withAuth";

const CreatePlaylist = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const validateName = (name) => {
        return name.length > 0 && name.length <= 50;
    };

    const validateDescription = (description) => {
        return description.length > 0 && description.length <= 1000;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateName(name)) {
            setError('Playlist name cannot be blank and should be max 50 characters long');
            return;
        }

        if (!validateDescription(description)) {
            setError('Playlist description cannot be blank and should be max 1000 characters long');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;
                const response = await fetch(`http://localhost:8080/api/playlists?idUser=${idUser}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({name, description})
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to create playlist');
                }

                navigate('/profile'); // Przekieruj do profilu lub listy playlist
                setError('');
            }

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="create-playlist-container">
            <h2>Create New Playlist</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="error">{error}</div>}
                <div>
                    <label>Playlisty Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Overview</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <button className="button" type="submit">Create</button>
            </form>
        </div>
    );
};

export default withAuth(CreatePlaylist);
