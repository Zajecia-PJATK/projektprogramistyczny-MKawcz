import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const MovieReviews = ({ movieId }) => {
    const [reviews, setReviews] = useState([]);
    const [reviewsLoaded, setReviewsLoaded] = useState(false);
    const [newReviewContent, setNewReviewContent] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(0);
    const [error, setError] = useState('');

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            if(token) {
                const response = await fetch(`http://localhost:8080/api/movies/${movieId}/reviews`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać recenzji');
                }

                const data = await response.json();
                setReviews(data);
                setReviewsLoaded(true);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddReview = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Najpierw pobieramy istniejące recenzje (i dodajemy film do bazy danych, jeśli go tam jeszcze nie ma)

                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;
                const reviewData = {
                    content: newReviewContent,
                    rating: newReviewRating,
                };

                const response = await fetch(`http://localhost:8080/api/movies/${movieId}/reviews?idUser=${idUser}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(reviewData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Nie udało się dodać recenzji');
                }

                const updatedReviews = await response.json();
                await fetchReviews();
                setReviews(updatedReviews);
                setNewReviewContent('');
                setNewReviewRating(0);
            }
        } catch (err) {
            setError(err.message);
        }
    };


    const handleDeleteReview = async (reviewId) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;
                const reviewData = {
                    content: newReviewContent,
                    rating: newReviewRating,
                };

                const response = await fetch(`http://localhost:8080/api/movies/${movieId}/reviews/${reviewId}?idUser=${idUser}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(reviewData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Nie udało się usunąć recenzji');
                }

                const updatedReviews = await response.json();
                setReviews(updatedReviews);
            }
        } catch (err) {
            setError(err.message);
        }
    };

                //TODO ukryć przycisk usunięcia jeżeli recenzja nie należy do zalogowanego użytkownika
    return (
        <div>
            <h3>Recenzje</h3>
            <div>
                <textarea
                    value={newReviewContent}
                    onChange={(e) => setNewReviewContent(e.target.value)}
                    placeholder="Dodaj swoją recenzję"
                />
                <input
                    type="number"
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                    placeholder="Ocena"
                    min="1"
                    max="10"
                />
                <button onClick={handleAddReview}>Dodaj recenzję</button>
            </div>
                {error && <p>{error}</p>}
                {!reviewsLoaded && <button onClick={fetchReviews}>Pokaż recenzje</button>}
                {reviewsLoaded && reviews.length === 0 ? <p>Ten film nie ma jeszcze recenzji.</p> : (
                    <ul>
                        {reviews.map(review => (
                            <li key={review.idReview}>
                                <p>{review.content}</p>
                                <p>Ocena: {review.rating}</p>
                                <p>Data dodania: {review.createdDate.slice(0, 10)}</p>
                                <button onClick={() => handleDeleteReview(review.idReview)}>Usuń recenzję</button>          {/*TODO wyświetlanie usera, który stworzył recenzje*/}
                            </li>
                        ))}
                    </ul>
                )}

        </div>
    );
};

export default MovieReviews;