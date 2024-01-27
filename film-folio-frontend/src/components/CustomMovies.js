import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import MovieAddForm from "./MovieAddForm";
import {jwtDecode} from "jwt-decode";
import "../styles/components/_custom_movies.scss"
import withAuth from "./withAuth";
import Loader from "./Loader";

const CustomMovies = () => {
    const [movies, setMovies] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const baseURL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    setIsAdmin(decodedToken.role.toString() === 'ROLE_ADMIN');

                    const response = await fetch('http://localhost:8080/api/tmdb/movies/custom', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch movies');
                    }

                    const data = await response.json();
                    setMovies(data);
                    setError('');
                }
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMovies();
    }, []);

    const handleDeleteMovie = async (movieId) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch(`http://localhost:8080/api/admin/movies/${movieId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete movie');
                }

                // Usuwanie filmu z listy na froncie
                setMovies(movies.filter(movie => movie.idMovie !== movieId));
                setError('');
            }
        } catch (err) {
            setError(err.message);
        }
    }

    const handleMovieAdded = (newMovie) => {
        setShowAddForm(false);
        setMovies([...movies, newMovie]);
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="custom-movies-container">
            <div className="page-title">
                <h1>Custom Movies</h1>
                {isAdmin && (
                    <button className="button" onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? "Close" : "Add New Movie"}
                    </button>
                )}
            </div>
            {showAddForm && (
                <MovieAddForm
                    onMovieAdded={handleMovieAdded}
                    onClose={() => setShowAddForm(false)}
                />
            )}
            <div className="movies-container">
                {error && <div className="error">{error}</div>}
            {movies.map(movie => (
                <div key={movie.idMovie} className="movie-item">
                    <Link to={`/movies/custom/${movie.idMovie}`}>
                        <img
                            src={movie.poster_path ? `${baseURL}${movie.poster_path}` : require('../No_image_poster.png')}
                            alt={`Poster of ${movie.title}`}
                        />
                    </Link>
                    <Link to={`/movies/custom/${movie.idMovie}`}>
                        <p>{movie.title} ({movie.release_date.slice(0, 4)})</p>
                    </Link>
                    {isAdmin && (
                        <button className="delete-btn" onClick={() => handleDeleteMovie(movie.idMovie)}>X</button>
                    )}

            </div>
            ))}
        </div>
</div>
);
};
export default withAuth(CustomMovies);