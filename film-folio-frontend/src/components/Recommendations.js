import React, {useEffect, useRef, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";
import "../styles/components/_recommendations.scss";
import withAuth from "./withAuth";
import Loader from "./Loader";

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState('');
    const baseURL = "https://image.tmdb.org/t/p/w500";
    const recommendationsRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if(!token) {
                    throw new Error('No access. Please log in');
                }

                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;

                const response = await fetch(`http://localhost:8080/api/recommendations?idUser=${idUser}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user recommendations');
                }

                const data = await response.json();
                setRecommendations(data);
                setError('');
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchRecommendations();
    }, []);

    const scrollLeft = () => {
        if (recommendationsRef.current) {
            recommendationsRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (recommendationsRef.current) {
            recommendationsRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <h2>Your Recommendations</h2>
            {error && <div className="error">{error}</div>}
            <div className="recommendations-container">
                <button className="scroll-btn left" onClick={scrollLeft}>&lt;</button>
                <ul ref={recommendationsRef} className="recommendations">
                    {recommendations.map((movie) => (
                        <li key={movie.id} className="recommendation-item">
                            <div className="recommendation-item-content">
                                <Link to={`/movies/${movie.id}`}>
                                    <img
                                        src={movie.poster_path ? `${baseURL}${movie.poster_path}` : require('../No_image_poster.png')}
                                        alt={`Poster of ${movie.title}`}
                                    />
                                </Link>
                                <div className="recommendation-item-details">
                                    <Link to={`/movies/${movie.id}`}>
                                    <p>{movie.title} ({movie.release_date.slice(0, 4)})</p>
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <button className="scroll-btn right" onClick={scrollRight}>&gt;</button>
            </div>
        </div>
    );

};

export default withAuth(Recommendations);