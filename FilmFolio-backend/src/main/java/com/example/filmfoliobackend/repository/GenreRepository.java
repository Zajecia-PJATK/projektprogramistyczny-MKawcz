package com.example.filmfoliobackend.repository;

import com.example.filmfoliobackend.model.Genre;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenreRepository extends MongoRepository<Genre, Long> {
    Optional<Genre> findByTmdbIdGenre(Long tmdbIdGenre);
    Boolean existsByTmdbIdGenre(Long tmdbIdGenre);
}
