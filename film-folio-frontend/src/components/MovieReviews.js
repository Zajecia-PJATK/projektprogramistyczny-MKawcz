import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../styles/components/_reviews.scss'
import StarRating from "./StarRating";
import withAuth from "./withAuth";
import Loader from "./Loader";

const MovieReviews = ({ movieId }) => {
    const [reviews, setReviews] = useState([]);
    const [reviewsLoaded, setReviewsLoaded] = useState(false);
    const [newReviewContent, setNewReviewContent] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(0);
    const [error, setError] = useState('');

    const handleRating = (rating) => {
        setNewReviewRating(rating);
    };

    const validateContent = (content) => {
        return content.length > 0 && content.length <= 3000;
    };

    const validateRating = (rating) => {
        return rating >= 1 && rating <= 10;
    };

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
                    throw new Error('Failed to fetch reviews');
                }

                const data = await response.json();
                setReviews(data);
                setReviewsLoaded(true);
                setError('');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddReview = async () => {
        if (!validateContent(newReviewContent)) {
            setError('Review content cannot be blank and should be max 3000 characters long');
            return;
        }

        if (!validateRating(newReviewRating)) {
            setError('Rating must be between 1 and 10');
            return;
        }

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
                    throw new Error(errorData.message || 'Failed to fetch reviews');
                }

                const updatedReviews = await response.json();
                await fetchReviews();
                setReviews(updatedReviews);
                setNewReviewContent('');
                setNewReviewRating(0);
                setError('');
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
                    throw new Error(errorData.message || 'Failed to fetch reviews');
                }

                const updatedReviews = await response.json();
                setReviews(updatedReviews);
                setError('');
            }
        } catch (err) {
            setError(err.message);
        }
    };


                //TODO ukryć przycisk usunięcia jeżeli recenzja nie należy do zalogowanego użytkownika
    return (
        <div className="movie-reviews">
            <h3>Reviews</h3>
            <div className="add-review">
                <textarea
                    value={newReviewContent}
                    onChange={(e) => setNewReviewContent(e.target.value)}
                    placeholder="Add your review"
                />
                <StarRating rating={newReviewRating} setRating={handleRating} />
                <div className="review-controls">
                    <button className="button" onClick={handleAddReview}>Add Review</button>
                    {!reviewsLoaded && <button className="button show-reviews" onClick={fetchReviews}>Show Reviews</button>}
                </div>
            </div>
            {error && <div className="error">{error}</div>}
            {reviewsLoaded && reviews.length === 0 ? <p>This movie does not have any reviews yet</p> : (
                <ul>
                    {reviews.map(review => (
                        <li key={review.idReview}>
                            <div className="review-content">
                                <p>{review.content}</p>
                                <p className="rating">Rating: {review.rating}</p>
                                <p className="date">Date of publication: {review.createdDate.slice(0, 10)}</p>
                            </div>
                            <button className="button" onClick={() => handleDeleteReview(review.idReview)}>Delete Review</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default withAuth(MovieReviews);