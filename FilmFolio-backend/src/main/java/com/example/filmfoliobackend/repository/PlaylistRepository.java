package com.example.filmfoliobackend.repository;

import com.example.filmfoliobackend.model.Playlist;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistRepository extends MongoRepository<Playlist, Long> {
}
