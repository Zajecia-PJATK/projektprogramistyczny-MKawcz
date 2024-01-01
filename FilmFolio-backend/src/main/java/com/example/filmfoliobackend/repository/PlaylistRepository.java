package com.example.filmfoliobackend.repository;

import com.example.filmfoliobackend.model.Playlist;
import com.example.filmfoliobackend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlaylistRepository extends MongoRepository<Playlist, Long> {
    Boolean existsByName(String name);
    Optional<Playlist> findByIdPlaylist(String idPlaylist);

    Boolean existsByIdPlaylistAndUser(String playlistId, User user);

    // Zapytanie sprawdzające, czy film znajduje się w playliście
    @Query("{ '_id': ?0, 'movies': { $elemMatch: { 'tmdbIdMovie': ?1 } } }")
    boolean existsByIdPlaylistAndMoviesId(String playlistId, Long tmdbIdMovie);

}
