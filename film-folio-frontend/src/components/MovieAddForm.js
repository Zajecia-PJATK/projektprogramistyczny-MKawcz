import React, { useState } from 'react';

const MovieAddForm = ({ onMovieAdded }) => {
    const [title, setTitle] = useState('');
    const [overview, setOverview] = useState('');
    // const [posterPath, setPosterPath] = useState('');
    // const [backdropPath, setBackdropPath] = useState('');
    // const [voteAverage, setVoteAverage] = useState('');
    // const [voteCount, setVoteCount] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [runtime, setRuntime] = useState('');
    const [adult, setAdult] = useState(false);
    const [error, setError] = useState('');

    const handleAddMovie = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token) {
                setError("Brak dostępu");
                return;
            }

            const newMovie = {
                title,
                overview,
                // posterPath,
                // backdropPath,
                // voteAverage: Number(voteAverage),
                // voteCount: Number(voteCount),
                releaseDate,
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
                throw new Error(errorData.message || 'Nie udało się dodać nowego filmu');
            }

            onMovieAdded(await response.json());
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h3>Dodaj nowy film</h3>
            {error && <p className="error">{error}</p>}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tytuł"
            />
            <textarea
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Opis"
            />
            {/*<input*/}
            {/*    type="text"*/}
            {/*    value={posterPath}*/}
            {/*    onChange={(e) => setPosterPath(e.target.value)}*/}
            {/*    placeholder="Ścieżka do plakatu"*/}
            {/*/>*/}
            {/*<input*/}
            {/*    type="text"*/}
            {/*    value={backdropPath}*/}
            {/*    onChange={(e) => setBackdropPath(e.target.value)}*/}
            {/*    placeholder="Ścieżka do tła"*/}
            {/*/>*/}
            {/*<input*/}
            {/*    type="number"*/}
            {/*    value={voteAverage}*/}
            {/*    onChange={(e) => setVoteAverage(e.target.value)}*/}
            {/*    placeholder="Średnia ocen"*/}
            {/*/>*/}
            {/*<input*/}
            {/*    type="number"*/}
            {/*    value={voteCount}*/}
            {/*    onChange={(e) => setVoteCount(e.target.value)}*/}
            {/*    placeholder="Liczba głosów"*/}
            {/*/>*/}
            <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                placeholder="Data wydania"
            />
            <input
                type="number"
                value={runtime}
                onChange={(e) => setRuntime(e.target.value)}
                placeholder="Czas trwania (minuty)"
            />
            <div>
                <label>
                    Dla dorosłych:
                    <input
                        type="checkbox"
                        checked={adult}
                        onChange={() => setAdult(!adult)}
                    />
                </label>
            </div>
            <button onClick={handleAddMovie}>Dodaj film</button>
        </div>
    );

};

export default MovieAddForm;