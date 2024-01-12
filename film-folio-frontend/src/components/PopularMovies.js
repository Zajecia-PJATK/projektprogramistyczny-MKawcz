import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PopularMovies = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const baseURL = "https://image.tmdb.org/t/p/w500";

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
                        <Link to={`/movies/${movie.id}`}>
                            <img width="150" height="200" src={`${baseURL}${movie.poster_path}`} alt={`Plakat filmu ${movie.title}`}/>
                        </Link>
                        <Link to={`/movies/${movie.id}`}>
                            <p>{movie.title} ({movie.release_date.slice(0, 4)})</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PopularMovies;