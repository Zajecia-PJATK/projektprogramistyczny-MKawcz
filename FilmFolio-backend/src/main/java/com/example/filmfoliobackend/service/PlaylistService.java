package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.dto.PlaylistDto;
import com.example.filmfoliobackend.mapper.MovieMapper;
import com.example.filmfoliobackend.mapper.PlaylistMapper;
import com.example.filmfoliobackend.model.Movie;
import com.example.filmfoliobackend.model.Playlist;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.repository.MovieRepository;
import com.example.filmfoliobackend.repository.PlaylistRepository;
import com.example.filmfoliobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public List<PlaylistDto> getPlaylists(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No user found with username: " + username));

        List<PlaylistDto> playlistsDto = user.getPlaylists().stream().map(PlaylistMapper::toDto).toList();

        return playlistsDto;
    }

    public PlaylistDto createPlaylist(String username, PlaylistDto playlistDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No user found with username: " + username));

        if(playlistRepository.existsByName(playlistDto.getName())) {
            throw new RuntimeException("Playlist with the given name already exists: " + playlistDto.getName());
        }

        Playlist playlist = PlaylistMapper.toDocument(playlistDto);

        playlist.setUser(user);
        playlistRepository.save(playlist);
        user.getPlaylists().add(playlist);
        userRepository.save(user);

        return PlaylistMapper.toDto(playlist);
    }

    public PlaylistDto updatePlaylist(String username, String playlistId , PlaylistDto playlistDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No user found with username: " + username));


        if(!playlistRepository.existsByIdPlaylistAndUser(playlistId, user)){
            throw new RuntimeException("Playlist with the given id doesn't belong to the user with the given id");
        }

        if(playlistRepository.existsByName(playlistDto.getName())) {
            throw new RuntimeException("Playlist with the given name already exists: " + playlistDto.getName());
        }

        Playlist playlist = playlistRepository.findByIdPlaylist(playlistId)
                .orElseThrow(() -> new RuntimeException("No playlist with the given id : " + playlistId));

        playlist.setName(playlistDto.getName());
        playlist.setDescription(playlistDto.getDescription());

        playlistRepository.save(playlist);

        return PlaylistMapper.toDto(playlist);
    }

    public List<PlaylistDto> deletePlaylist(String username, String playlistId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No user found with username: " + username));

        Playlist playlist = playlistRepository.findByIdPlaylist(playlistId)
                .orElseThrow(() -> new RuntimeException("No playlist with the given id : " + playlistId));

        if(!playlistRepository.existsByIdPlaylistAndUser(playlistId, user)){
            throw new RuntimeException("Playlist with the given id doesn't belong to the user with the given id");
        }

        user.getPlaylists().remove(playlist);
        userRepository.save(user);
        playlistRepository.delete(playlist);

        return getPlaylists(username);
    }

    public MovieDto addMovieToPlaylist(String username, String playlistId, MovieDto movieDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No user found with username: " + username));

        Movie movie = movieRepository.findByTmdbIdMovie(movieDto.getTmdbIdMovie())
                .orElseGet(() -> MovieMapper.toDocument(movieDto));

        Playlist playlist = playlistRepository.findByIdPlaylist(playlistId)
                .orElseThrow(() -> new RuntimeException("No playlist with the given id : " + playlistId));

        if(!playlistRepository.existsByIdPlaylistAndUser(playlistId, user)){
            throw new RuntimeException("Playlist with the given id doesn't belong to the user with the given id");
        }

        movie.getPlaylists().add(playlist);
        movieRepository.save(movie);

        playlist.getMovies().add(movie);
        playlistRepository.save(playlist);

        return MovieMapper.toDto(movie);
    }

    public List<MovieDto> deleteMovieFromPlaylist(String username, String playlistId, Long tmdbIdMovie) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No user found with username: " + username));

        Movie movie = movieRepository.findByTmdbIdMovie(tmdbIdMovie)
                .orElseThrow(() -> new RuntimeException("No user found with TMDB id: " + tmdbIdMovie));

        Playlist playlist = playlistRepository.findByIdPlaylist(playlistId)
                .orElseThrow(() -> new RuntimeException("No playlist with the given id : " + playlistId));

        if(!playlistRepository.existsByIdPlaylistAndUser(playlistId, user)){
            throw new RuntimeException("Playlist with the given id doesn't belong to the user with the given id");
        }

        if(!playlistRepository.existsByIdPlaylistAndMoviesId(playlistId, tmdbIdMovie)) {
            throw new RuntimeException("Movie with the given TMDB id doesn't belong to the playlist with the given id");
        }

        playlist.getMovies().remove(movie);
        playlistRepository.save(playlist);
        movie.getPlaylists().remove(playlist);
        movieRepository.save(movie);

        return playlist.getMovies().stream().map(MovieMapper::toDto).toList();
    }



}
