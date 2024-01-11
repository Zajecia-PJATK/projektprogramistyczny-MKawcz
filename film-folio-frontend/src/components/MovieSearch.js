import React, { useState, useEffect  } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const MovieSearch = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const query = searchParams.get('query');
        const includeAdult = searchParams.get('includeAdult') === 'true';
        if (query) {
            const fetchMovies = async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        const response = await fetch(`http://localhost:8080/api/tmdb/movies/search?query=${query}&includeAdult=${includeAdult}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (!response.ok) {
                            throw new Error('Błąd wyszukiwania');
                        }
                        const data = await response.json();
                        setMovies(data);
                    }
                } catch (err) {
                    setError(err.message);
                }
            };
            fetchMovies();
        }
    }, [searchParams]);

    if(error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div>
            <h1>Wyniki wyszukiwania</h1>
            <ul>
                {movies.map(movie => (
                    <li key={movie.tmdbIdMovie}>
                        <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MovieSearch;
