import React, { useState } from 'react';
import withAuth from "./withAuth";

const MovieEditForm = ({ movie, onSave, onClose }) => {                      //TODO formularz edycji nie znika po zapisaniu zmian oraz nie pojawia się data
    const [title, setTitle] = useState(movie.title);
    const [overview, setOverview] = useState(movie.overview);
    const [releaseDate, setReleaseDate] = useState(movie.release_date);
    const [runtime, setRuntime] = useState(movie.runtime);
    const [adult, setAdult] = useState(movie.adult);
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

    const handleUpdateMovie = async () => {

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
            if (!token) {
                setError("No access, please log in.");
                return;
            }

            const updatedMovie = {
                title,
                overview,
                release_date: releaseDate,
                runtime,
                adult
            };

            const response = await fetch(`http://localhost:8080/api/admin/movies/${movie.idMovie}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedMovie)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update movie');
            }

            onSave(await response.json());
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <div className="form-overlay">
            <div className="form-container">
                <button className="close-form-btn" onClick={onClose}>X</button>
                <h3>Edit Movie</h3>
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
                <button className="button" onClick={handleUpdateMovie}>Save Changes</button>
            </div>
        </div>

    );
};

export default withAuth(MovieEditForm);