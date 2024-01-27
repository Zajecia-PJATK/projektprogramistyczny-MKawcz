import React, { useState } from 'react';
import '../styles/components/_movie_add_form.scss';
import withAuth from "./withAuth";

const MovieAddForm = ({ onMovieAdded, onClose  }) => {
    const [title, setTitle] = useState('');
    const [overview, setOverview] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [runtime, setRuntime] = useState('');
    const [adult, setAdult] = useState(false);
    const [error, setError] = useState('');

    const validateTitle = (title) => {
        return title.length > 0 && title.length <= 50;
    };

    const validateOverview = (overview) => {
        return overview.length > 0 && overview.length <= 2000;
    };

    const validateRuntime = (runtime) => {
        const runtimeNumber = Number(runtime);
        return !isNaN(runtimeNumber) && runtimeNumber >= 0;
    };

    const handleAddMovie = async () => {
        if (!validateTitle(title)) {
            setError('Movie title cannot be blank and should be max 50 characters long');
            return;
        }

        if (!validateOverview(overview)) {
            setError('Movie overview cannot be blank and should be max 2000 characters long');
            return;
        }

        if (!validateRuntime(runtime)) {
            setError('Runtime cannot be blank and cannot be less than 0');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if(token) {
                const newMovie = {
                    title,
                    overview,
                    release_date: releaseDate,
                    runtime: Number(runtime),
                    adult
                };

                const response = await fetch('http://localhost:8080/api/admin/movies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newMovie)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to add new movie');
                }

                onMovieAdded(await response.json());
                setError('');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-container">
                <button className="close-form-btn" onClick={onClose}>X</button>
                <h3>Add New Movie</h3>
                {error && <p className="error">{error}</p>}
                <div className="form-row">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                    />
                    <textarea
                        value={overview}
                        onChange={(e) => setOverview(e.target.value)}
                        placeholder="Overview"
                    />
                </div>
                <div className="form-row">
                    <input
                        type="date"
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                        placeholder="Release Date"
                    />
                    <input
                        type="number"
                        value={runtime}
                        min="0"
                        onChange={(e) => setRuntime(e.target.value)}
                        placeholder="Runtime (minutes)"
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={adult}
                            onChange={() => setAdult(!adult)}
                        />
                        Adult
                    </label>
                </div>
                <button className="button" onClick={handleAddMovie}>Add Movie</button>
            </div>
        </div>
    );
};

export default withAuth(MovieAddForm);