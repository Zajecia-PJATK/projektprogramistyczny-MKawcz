import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MovieDetails = () => {
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState('');
    const {movieId} = useParams();
    const baseURL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch(`http://localhost:8080/api/tmdb/movies/${movieId}`,{
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Nie udało się pobrać danych');
                    }
                    const data = await response.json();
                    setMovie(data);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    if (!movie) {
        return <div>Ładowanie...</div>;
    }

    return (
        <div>
            <h1>{movie.title}</h1>
            <img src={`${baseURL}${movie.poster_path}`} alt={`Plakat filmu ${movie.title}`}/>
            <img src={`${baseURL}${movie.backdrop_path}`} alt={`Tło filmu ${movie.title}`}/>
            <p>{movie.overview}</p>
            <p>Średnia ocena: {movie.vote_average} (Liczba głosów: {movie.vote_count})</p>
            <p>Data wydania: {movie.release_date}</p>
            {movie.runtime && <p>Czas trwania: {movie.runtime} minut</p>}
            <p>Dla dorosłych: {movie.adult ? 'Tak' : 'Nie'}</p>
        </div>
    );
};

export default MovieDetails;