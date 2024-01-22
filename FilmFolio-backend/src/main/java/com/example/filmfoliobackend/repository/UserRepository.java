package com.example.filmfoliobackend.repository;

import com.example.filmfoliobackend.model.Movie;
import com.example.filmfoliobackend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
//    @Query("{ '_id': ?0, 'watchlist': { $elemMatch: { 'tmdbIdMovie': ?1 } } }")
//    Boolean existsByIdUserAndWatchlistTmdbIdMovie(String userId, Long tmdbIdMovie);
    Optional<User> findByIdUser(String userId);

    List<User> findAllByWatchlistContaining(Movie movie);
}
