import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const MovieDetails = () => {
    const [movie, setMovie] = useState(null);
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

        fetchMovieDetails();
    }, [movieId]);

    const handleAddToPlaylist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token && selectedPlaylist) {
                const response = await fetch(`http://localhost:8080/api/playlists/${selectedPlaylist}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ tmdbIdMovie: movieId })
                });

                if (!response.ok) {
                    throw new Error('Nie udało się dodać filmu do playlisty');
                }

                alert('Film został dodany do playlisty');
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

            <select value={selectedPlaylist} onChange={(e) => setSelectedPlaylist(e.target.value)}>
                <option value="">Wybierz playlistę</option>
                {playlists.map(playlist => (
                    <option key={playlist.idPlaylist} value={playlist.idPlaylist}>{playlist.name}</option>
                ))}
            </select>
            <button onClick={handleAddToPlaylist}>Dodaj do playlisty</button>
        </div>
    );
};

export default MovieDetails;
