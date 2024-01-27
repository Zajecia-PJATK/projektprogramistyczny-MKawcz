import React, { useState, useEffect  } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import '../styles/components/_search_movies.scss';
import withAuth from "./withAuth";
import Loader from "./Loader";

const MovieSearch = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const baseURL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        const query = searchParams.get('query');
        const includeAdult = searchParams.get('includeAdult') === 'true';
        const primaryReleaseDate = searchParams.get('primaryReleaseDate');
        if (query) {
            const fetchMovies = async () => {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        const response = await fetch(`http://localhost:8080/api/tmdb/movies/search?query=${query}&includeAdult=${includeAdult}&primaryReleaseDate=${primaryReleaseDate}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (!response.ok) {
                            throw new Error('Failed to search for movies');
                        }
                        const data = await response.json();
                        setMovies(data);
                        setError('');
                        setIsLoading(false);
                    }
                } catch (err) {
                    setError(err.message);
                }
            };
            fetchMovies();
        }
    }, [searchParams]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="search-movies-container">
            <div className="page-title">
                <h1>Search Results</h1>
            </div>
            <div className="movies-container">
                {error && <div className="error">{error}</div>}
                {movies.length === 0 && <di>Brak wyników :(</di>}
                {movies.map((movie, index) => (
                    <div key={movie.id} data-index={index + 1} className="movie-item">
                        <Link to={`/movies/${movie.id}`}>
                            <img
                                src={movie.poster_path ? `${baseURL}${movie.poster_path}` : require('../No_image_poster.png')}
                                alt={`Poster of ${movie.title}`}
                            />
                        </Link>
                        <Link to={`/movies/${movie.id}`}>
                            <p>{movie.title} ({movie.release_date.slice(0, 4)})</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default withAuth(MovieSearch);
