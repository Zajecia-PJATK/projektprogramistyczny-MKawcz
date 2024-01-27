import React, {useEffect, useRef, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";
import "../styles/components/_watchlist.scss";
import withAuth from "./withAuth";
import Loader from "./Loader";

const UserWatchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [error, setError] = useState('');
    const baseURL = "https://image.tmdb.org/t/p/w500";
    const watchlistRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlist = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const idUser = decodedToken.userId; // lub użyj odpowiedniego pola z tokenu
                    const response = await fetch(`http://localhost:8080/api/watchlist?idUser=${idUser}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch user watchlist');
                    }

                    const data = await response.json();
                    setWatchlist(data);
                    setError('');
                    setIsLoading(false);
                } catch (err) {
                    setError(err.message);
                }
            }
        };

        fetchWatchlist();
    }, []);

    const scrollLeft = () => {
        if (watchlistRef.current) {
            watchlistRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (watchlistRef.current) {
            watchlistRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

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
                    throw new Error('Failed to delete movie from user watchlist');
                }

                setWatchlist(watchlist.filter(movie => movie.id !== tmdbIdMovie));
                setError('');
                window.location.reload();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="watchlist-content-container">
            <h2>Your Watchlist</h2>
            {error && <div className="error">{error}</div>}
            {watchlist.length === 0 ? (
                <div>
                    <p>No Movies in Watchlist</p>
                </div>
            ) : (
                <div className="watchlist-container">
                    <button className="scroll-btn left" onClick={scrollLeft}>&lt;</button>
                    <ul ref={watchlistRef} className="watchlist">
                        {watchlist.map(movie => (
                            <li key={movie.id} className="watchlist-item">
                                <div className="watchlist-item-content">
                                    <Link to={`/movies/${movie.id}`}>
                                        <img
                                            src={movie.poster_path ? `${baseURL}${movie.poster_path}` : require('../No_image_poster.png')}
                                            alt={`Poster of ${movie.title}`}
                                        />
                                    </Link>
                                    <button className="button delete-btn"
                                            onClick={() => handleDeleteFromWatchlist(movie.id)}>X
                                    </button>
                                </div>
                                <div className="watchlist-item-details">
                                    <Link to={`/movies/${movie.id}`}>
                                        <p>{movie.title} ({movie.release_date.slice(0, 4)})</p>
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button className="scroll-btn right" onClick={scrollRight}>&gt;</button>
                </div>
            )}
        </div>
    );
};

export default withAuth(UserWatchlist);