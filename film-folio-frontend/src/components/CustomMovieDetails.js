import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import MovieEditForm from "./MovieEditForm";
import '../styles/components/_movie_details.scss'
import withAuth from "./withAuth";
import Loader from "./Loader";

const CustomMovieDetails = () => {
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const {movieId} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const baseURL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        const fetchMovieDetails = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    setIsAdmin(decodedToken.role.toString() === 'ROLE_ADMIN');
                    const response = await fetch(`http://localhost:8080/api/tmdb/movies/custom/${movieId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if(!response.ok) {
                        throw new Error('Failed to fetch movie details');
                    }

                    const data = await response.json();
                    setMovie(data);
                    setError('');
                    setIsLoading(false);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    const onMovieUpdate = (updatedMovie) => {
        // Aktualizacja stanu filmu
        setMovie(updatedMovie);
    };

    const toggleEditForm = () => {
        setShowEditForm(!showEditForm);
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="movie-details">
            <div className="movie-content" style={{backgroundImage: `url(${baseURL}${movie.backdrop_path})`}}>
                {error && <p className="error">{error}</p>}
                <div className="backdrop-overlay"></div>
                <div className="movie-poster">
                    <img
                        src={movie.poster_path ? `${baseURL}${movie.poster_path}` : require('../No_image_poster.png')}
                        alt={`Poster of ${movie.title}`}
                    />
                </div>
                <div className="movie-info">
                    <h1>{movie.title}</h1>
                    <p>{movie.overview}</p>
                    <p>Release date: {movie.release_date}</p>
                    {movie.runtime && <p>Runtime: {movie.runtime} minutes</p>}
                    <p>Adult: {movie.adult ? 'Yes' : 'No'}</p>
                </div>
                <div className="controls-container">
                    {isAdmin && (
                        <button className="button" onClick={toggleEditForm}>Edit Movie</button>
                    )}

                    {showEditForm &&
                        <MovieEditForm
                            movie={movie}
                            onSave={onMovieUpdate}
                            onClose={() => setShowEditForm(false)}
                        />}
                </div>
            </div>
        </div>
    );
};

export default withAuth(CustomMovieDetails);