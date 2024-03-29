package com.example.filmfoliobackend.repository;

import com.example.filmfoliobackend.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends MongoRepository<Movie, Long> {
    Boolean existsByTmdbIdMovie(Long tmdbIdMovie);
    Optional<Movie> findByTmdbIdMovie(Long tmdbIdMovie);
    Optional<Movie> findByIdMovie(String idMovie);
    List<Movie> findAllByIsCustomTrue();
}
