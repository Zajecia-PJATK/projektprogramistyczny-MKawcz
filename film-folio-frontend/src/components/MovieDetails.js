import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import MovieReviews from './MovieReviews';

const MovieDetails = () => {
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');
    const [error, setError] = useState('');
    const { movieId } = useParams();
    const baseURL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch(`http://localhost:8080/api/tmdb/movies/${movieId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Nie udało się pobrać informacji o filmie');
                    }

                    const data = await response.json();
                    setMovie(data);

                    const decodedToken = jwtDecode(token);
                    const idUser = decodedToken.userId;

                    const playlistsResponse = await fetch(`http://localhost:8080/api/playlists?idUser=${idUser}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (playlistsResponse.ok) {
                        const playlistsData = await playlistsResponse.json();
                        setPlaylists(playlistsData);
                    }
                }
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchMovieCast = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch(`http://localhost:8080/api/movies/cast?idMovie=${movieId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Nie udało się pobrać informacji o obsadzie');
                    }

                    const data = await response.json();
                    setCast(data);

                }
            } catch (err) {
                setError(err.message);
            }
        }

        fetchMovieDetails();
        fetchMovieCast();
    }, [movieId]);

    const handleAddToPlaylist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token && selectedPlaylist && movie) {
                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;
                const movieData = {
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path,
                    vote_average: movie.vote_average,
                    vote_count: movie.vote_count,
                    release_date: movie.release_date,
                    runtime: movie.runtime,
                    adult: movie.adult,
                    genres: movie.genres.map(genre => ({ id: genre.id, name: genre.name }))
                };
                const response = await fetch(`http://localhost:8080/api/playlists/${selectedPlaylist}?idUser=${idUser}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(movieData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Nie udało się dodać filmu do playlisty');
                }

                alert('Film został dodany do playlisty');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddToWatchlist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token && movie) {
                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;
                const movieData = {
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path,
                    vote_average: movie.vote_average,
                    vote_count: movie.vote_count,
                    release_date: movie.release_date,
                    runtime: movie.runtime,
                    adult: movie.adult,
                    genres: movie.genres.map(genre => ({ id: genre.id, name: genre.name }))
                };
                const response = await fetch(`http://localhost:8080/api/watchlist?idUser=${idUser}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(movieData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Nie udało się dodać filmu do watchlisty');
                }

                alert('Film został dodany do Twojej watchlisty');
            }
        } catch (err) {
            setError(err.message);
        }
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
            <img src={`${baseURL}${movie.poster_path}`} alt={`Plakat filmu ${movie.title}`}/>
            <img src={`${baseURL}${movie.backdrop_path}`} alt={`Tło filmu ${movie.title}`}/>
            <p>{movie.overview}</p>
            <p>Średnia ocena: {movie.vote_average} (Liczba głosów: {movie.vote_count})</p>
            <p>Data wydania: {movie.release_date}</p>
            {movie.runtime && <p>Czas trwania: {movie.runtime} minut</p>}
            <p>Dla dorosłych: {movie.adult ? 'Tak' : 'Nie'}</p>
            <p>Gatunki:</p>
            <ul>
                {movie.genres.map(genre => (
                   <li key={genre.id}>
                       <p>{genre.name}</p>
                   </li>
                ))}
            </ul>
            <p>Obsada:</p>
            <ul>
                {cast.map(actor => (
                    <li key={actor.id}>
                        <img width="150" height="200" src={`${baseURL}${actor.profile_path}`}
                             alt={`Zdjęcie profilowe ${actor.name}`}/>
                        <p>{actor.name} jako {actor.character}</p>
                    </li>
                ))}
            </ul>

            <select value={selectedPlaylist} onChange={(e) => setSelectedPlaylist(e.target.value)}>
                <option value="">Wybierz playlistę</option>
                {playlists.map(playlist => (
                    <option key={playlist.idPlaylist} value={playlist.idPlaylist}>{playlist.name}</option>
                ))}
            </select>
            <button onClick={handleAddToPlaylist}>Dodaj do playlisty</button>
            <button onClick={handleAddToWatchlist}>Dodaj do Watchlisty</button>

            <MovieReviews movieId={movieId} />

        </div>
    );
};

export default MovieDetails;
