package com.example.filmfoliobackend.repository;

import com.example.filmfoliobackend.model.Review;
import com.example.filmfoliobackend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, Long> {
    Optional<Review> findByIdReview(String idReview);

    Boolean existsByIdReviewAndUser(String reviewId, User user);

//    @Query("{ '_id': ?0, 'movie.tmdbIdMovie': ?1 }")
//    Boolean existsByIdReviewAndMovieTmdbIdMovie(String reviewId, Long tmdbIdMovie);

}
