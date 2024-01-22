import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const CreatePlaylist = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Brak dostępu.");
                return;
            }
                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;
                const response = await fetch(`http://localhost:8080/api/playlists?idUser=${idUser}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ name, description })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Nie udało się utworzyć playlisty');
                }

                navigate('/profile'); // Przekieruj do profilu lub listy playlist

        } catch (err) {
            setError(err.message);
        }
    };

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div>
            <h1>Stwórz nową playlistę</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nazwa playlisty</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Opis</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit">Stwórz</button>
            </form>
        </div>
    );
};

export default CreatePlaylist;
