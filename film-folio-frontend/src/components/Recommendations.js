import React, { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState('');
    const baseURL = "https://image.tmdb.org/t/p/w500";

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const token = localStorage.getItem('token');
                if(!token) {
                    throw new Error('Brak dostępu. Proszę się zalogować');
                }

                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;

                const response = await fetch(`http://localhost:8080/api/recommendations?idUser=${idUser}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać rekomendacji');
                }

                const data = await response.json();
                setRecommendations(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchRecommendations();
    }, []);

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div>
            <h2>Rekomendacje dla Ciebie</h2>
            {recommendations.length === 0 ? (
                <p>Brak rekomendacji do wyświetlenia.</p>
            ) : (
                <ul>
                    {recommendations.map((movie) => (
                        <div key={movie.id}>
                            <Link to={`/movies/${movie.id}`}>
                                <img width="150" height="200" src={`${baseURL}${movie.poster_path}`}
                                     alt={`Plakat filmu ${movie.title}`}/>
                            </Link>
                            <Link to={`/movies/${movie.id}`}>
                                <p>{movie.title} ({movie.release_date.slice(0, 4)})</p>
                            </Link>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );

};

export default Recommendations;