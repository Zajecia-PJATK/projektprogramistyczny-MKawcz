import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import MovieReviews from './MovieReviews';
import '../styles/components/_movie_details.scss'
import withAuth from "./withAuth";
import Loader from "./Loader";

const MovieDetails = () => {
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');
    const [error, setError] = useState('');
    const {movieId} = useParams();
    const baseURL = "https://image.tmdb.org/t/p/w500";
    const castRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch(`http://localhost:8080/api/tmdb/movies/${movieId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch movie details');
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

                    setError('');
                    setIsLoading(false);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchMovieCast = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch(`http://localhost:8080/api/movies/cast?idMovie=${movieId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch movie cast');
                    }

                    const data = await response.json();
                    setCast(data);
                    setError('');
                    setIsLoading(false);
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
                    genres: movie.genres.map(genre => ({id: genre.id, name: genre.name}))
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
                    throw new Error(errorData.message || 'Failed to add movie to playlist');
                }

                setError('');
                alert('Successfully added the movie to the playlist!');
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
                    genres: movie.genres.map(genre => ({id: genre.id, name: genre.name}))
                };

                console.log(movieData);

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
                    throw new Error(errorData.message || 'Failed to add movie to watchlist');
                }

                setError('');
                alert('Successfully added the movie to the watchlist!');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const scrollLeft = () => {
        if (castRef.current) {
            castRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (castRef.current) {
            castRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    if (isLoading || !movie) {
        return <Loader />;
    }

    return (
        <div className="movie-details">

            <div
                className="movie-content"
                style={{
                    backgroundImage: movie.backdrop_path ? `url(${baseURL}${movie.backdrop_path})` : 'none'
                }}
            >
                <div className="backdrop-overlay"></div>
                <div className="movie-poster">
                    <img
                        src={movie.poster_path ? `${baseURL}${movie.poster_path}` : require('../No_image_poster.png')}
                        alt={`Poster of ${movie.title}`}
                    />
                </div>
                <div className="movie-info">
                    {error && <div className="error">{error}</div>}
                    <h1>{movie.title}</h1>
                    <p>{movie.overview}</p>
                    <p>Average rating: {movie.vote_average} (number of votes: {movie.vote_count})</p>
                    <p>Release date: {movie.release_date}</p>
                    {movie.runtime && <span className="runtime">Runtime: {movie.runtime}</span>}
                    <p>Adult: {movie.adult ? 'Yes' : 'No'}</p>
                    <p>Genres:</p>
                    <ul>
                        {movie.genres.map(genre => (
                            <li key={genre.id}>
                                <p>{genre.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="controls-container">
                    <select value={selectedPlaylist} onChange={(e) => setSelectedPlaylist(e.target.value)}>
                        <option value="">Select a playlist</option>
                        {playlists.map(playlist => (
                            <option key={playlist.idPlaylist} value={playlist.idPlaylist}>{playlist.name}</option>
                        ))}
                    </select>
                    <button className="button" onClick={handleAddToPlaylist}>Add to Playlist</button>
                    <button className="button" onClick={handleAddToWatchlist}>Add to Watchlist</button>
                </div>
            </div>
            <div className="movie-cast">
                <h1>Cast</h1>
                {cast.length !== 0 &&
                    <div className="cast-container">
                        <button className="scroll-btn left" onClick={scrollLeft}>&lt;</button>
                    <ul ref={castRef} className="cast">
                        {cast.map(actor => (
                            <li key={actor.id} className="cast-item">
                                <div className="cast-item-content">
                                    <img
                                        src={actor.profile_path ? `${baseURL}${actor.profile_path}` : require('../No_image_poster.png')}
                                        alt={`Image of ${actor.name}`}
                                    />
                                </div>
                                <div className="cast-item-details">
                                    <p>{actor.name} as {actor.character}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button className="scroll-btn right" onClick={scrollRight}>&gt;</button>
                </div>
                }
            </div>
            <div className="review-container">
                <MovieReviews movieId={movieId}/>
            </div>
        </div>
    );
};

export default withAuth(MovieDetails);