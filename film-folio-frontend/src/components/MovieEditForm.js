import React, { useState } from 'react';

const MovieEditForm = ({ movie, onSave }) => {                      //TODO formularz edycji nie znika po zapisaniu zmian oraz nie pojawia się data
    const [title, setTitle] = useState(movie.title);
    const [overview, setOverview] = useState(movie.overview);
    // const [posterPath, setPosterPath] = useState(movie.poster_path);
    // const [backdropPath, setBackdropPath] = useState(movie.backdrop_path);
    // const [voteAverage, setVoteAverage] = useState(movie.vote_average);
    // const [voteCount, setVoteCount] = useState(movie.overview);
    const [releaseDate, setReleaseDate] = useState(movie.release_date);
    const [runtime, setRuntime] = useState(movie.runtime);
    const [adult, setAdult] = useState(movie.adult);
    const [error, setError] = useState('');

    const handleUpdateMovie = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Brak dostępu.");
                return;
            }

            const updatedMovie = {
                title,
                overview,
                // posterPath,
                // backdropPath,
                // voteAverage,
                releaseDate,
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
                throw new Error(errorData.message || 'Nie udało się zaktualizować filmu');
            }

            onSave(await response.json());
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div>
            <h3>Edytuj Film</h3>
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
            <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                placeholder="Średnia ocen"
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
            <button onClick={handleUpdateMovie}>Zapisz zmiany</button>
        </div>
    );
};

export default MovieEditForm;