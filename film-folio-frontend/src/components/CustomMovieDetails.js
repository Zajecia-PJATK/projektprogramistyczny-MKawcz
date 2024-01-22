import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import MovieEditForm from "./MovieEditForm";

const CustomMovieDetails = () => {
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const {movieId} = useParams();

    useEffect(() => {
        const fetchMovieDetails = async () => {
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

                    const data = await response.json();
                    setMovie(data);
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


    if (error) {
        return <div>Błąd: {error}</div>;
    }

    if (!movie) {
        return <div>Ładowanie...</div>;
    }

    return (
        <div>
            <h1>{movie.title}</h1>
            {/*<img src={`${baseURL}${movie.poster_path}`} alt={`Plakat filmu ${movie.title}`}/>*/}
            {/*<img src={`${baseURL}${movie.backdrop_path}`} alt={`Tło filmu ${movie.title}`}/>*/}
            <p>{movie.overview}</p>
            {/*<p>Średnia ocena: {movie.vote_average} (Liczba głosów: {movie.vote_count})</p>*/}
            <p>Data wydania: {movie.release_date}</p>
            {movie.runtime && <p>Czas trwania: {movie.runtime} minut</p>}
            <p>Dla dorosłych: {movie.adult ? 'Tak' : 'Nie'}</p>

            {isAdmin && (
                <button onClick={toggleEditForm}>
                    {showEditForm ? 'Ukryj formularz edycji' : 'Edytuj film'}
                </button>
            )}

            {showEditForm && <MovieEditForm movie={movie} onSave={onMovieUpdate} />}

        </div>
    );
};

export default CustomMovieDetails;