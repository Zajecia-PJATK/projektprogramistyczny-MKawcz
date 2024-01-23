import React, {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";

const UserWatchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [error, setError] = useState('');
    const baseURL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        const fetchWatchlist = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const idUser = decodedToken.userId; // lub użyj odpowiedniego pola z tokenu
                    const response = await fetch(`http://localhost:8080/api/watchlist?idUser=${idUser}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (!response.ok) {
                        throw new Error('Błąd podczas pobierania watchlisty');
                    }

                    const data = await response.json();
                    setWatchlist(data);
                } catch (err) {
                    setError(err.message);
                }
            }
        };

        fetchWatchlist();
    }, []);

    const handleDeleteFromWatchlist = async (tmdbIdMovie) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;
                const response = await fetch(`http://localhost:8080/api/watchlist/${tmdbIdMovie}?idUser=${idUser}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Nie udało się usunąć filmu z watchlisty');
                }

                setWatchlist(watchlist.filter(movie => movie.id !== tmdbIdMovie));
                window.location.reload();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div>
            <h2>Twoja Watchlista</h2>
            {error && <p>{error}</p>}
            <ul>
                {watchlist.map(movie => (
                    <li key={movie.id}>
                        <Link to={`/movies/${movie.id}`}>
                            <img width="150" height="200" src={`${baseURL}${movie.poster_path}`}
                                 alt={`Plakat filmu ${movie.title}`}/>
                        </Link>
                        <Link to={`/movies/${movie.id}`}>
                            <p>{movie.title} ({movie.release_date.slice(0, 4)})</p>
                        </Link>
                        <button onClick={() => handleDeleteFromWatchlist(movie.id)}>Usuń z Watchlisty</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserWatchlist;