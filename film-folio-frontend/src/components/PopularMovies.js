import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PopularMovies = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch('http://localhost:8080/api/tmdb/movies/popular', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Nie udało się pobrać danych profilu');
                    }

                    const data = await response.json();
                    setMovies(data);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMovies();
    }, []);

    if(error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div>
            <h1>Popularne filmy</h1>
            <ul>
                {movies.map(movie => (
                    <li key={movie.tmdbIdMovie}>
                        <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PopularMovies;