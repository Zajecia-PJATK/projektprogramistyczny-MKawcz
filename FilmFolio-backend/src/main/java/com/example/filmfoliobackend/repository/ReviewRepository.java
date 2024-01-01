package com.example.filmfoliobackend.repository;

import com.example.filmfoliobackend.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, Long> {
    Optional<Review> findByIdReview(String idReview);

    @Query("{ '_id': ?0, 'user.username': ?1 }")
    boolean existsByIdReviewAndUsername(String reviewId, String username);

    @Query("{ '_id': ?0, 'movie.tmdbIdMovie': ?1 }")
    boolean existsByIdReviewAndMovieTmdbIdMovie(String reviewId, Long tmdbIdMovie);

}
