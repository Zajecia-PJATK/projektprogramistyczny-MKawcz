package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.dto.PlaylistDto;
import com.example.filmfoliobackend.exception.*;
import com.example.filmfoliobackend.mapper.MovieMapper;
import com.example.filmfoliobackend.mapper.PlaylistMapper;
import com.example.filmfoliobackend.model.Movie;
import com.example.filmfoliobackend.model.Playlist;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.repository.GenreRepository;
import com.example.filmfoliobackend.repository.MovieRepository;
import com.example.filmfoliobackend.repository.PlaylistRepository;
import com.example.filmfoliobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final MovieService movieService;

    public List<PlaylistDto> getPlaylists(String idUser, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        List<PlaylistDto> playlistsDto = user.getPlaylists().stream().map(PlaylistMapper::toDto).toList();

        return playlistsDto;
    }

    public PlaylistDto getPlaylist(String idUser, String playlistId, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        Playlist playlist = playlistRepository.findByIdPlaylist(playlistId)
                .orElseThrow(() -> new PlaylistNotFoundException("No playlist found with the id : " + playlistId));

        if(!playlistRepository.existsByIdPlaylistAndUser(playlistId, user)){
            throw new ResourceOwnershipException("Playlist with ID " + playlistId + " does not belong to the user " + user.getActualUsername());
        }

        PlaylistDto playlistDto = PlaylistMapper.toDto(playlist);

        List<MovieDto> movieDtos = playlist.getMovies().stream()
                .map(MovieMapper::toDto).toList();

        playlistDto.setMovies(movieDtos);

        return playlistDto;
    }

    public PlaylistDto createPlaylist(String idUser, PlaylistDto playlistDto, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        if(playlistRepository.existsByNameAndUser(playlistDto.getName(), user)) {
            throw new DuplicateResourceException("Playlist with the name already exists: " + playlistDto.getName());
        }

        Playlist playlist = PlaylistMapper.toDocument(playlistDto);

        playlist.setUser(user);
        playlistRepository.save(playlist);
        user.getPlaylists().add(playlist);
        userRepository.save(user);

        return PlaylistMapper.toDto(playlist);
    }

    public PlaylistDto updatePlaylist(String idUser, String playlistId , PlaylistDto playlistDto, Authentication authentication) {   //TODO po stronie Fronta trzeba będzie dać domyślne wartości (te które są zapisane obecnie) aby nie ustawiać pól na null dla pól dla, których nie podano wartości
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        Playlist playlist = playlistRepository.findByIdPlaylist(playlistId)
                .orElseThrow(() -> new PlaylistNotFoundException("No playlist found with the id : " + playlistId));

        if(!playlistRepository.existsByIdPlaylistAndUser(playlistId, user)){
            throw new ResourceOwnershipException("Playlist with ID " + playlistId + " does not belong to the user " + user.getActualUsername());
        }

        if(!playlist.getName().equals(playlistDto.getName()) && playlistRepository.existsByNameAndUser(playlistDto.getName(), user)) {
            throw new DuplicateResourceException("Playlist with the name " + playlistDto.getName() + " already exists: ");
        }

        playlist.setName(playlistDto.getName());
        playlist.setDescription(playlistDto.getDescription());

        playlistRepository.save(playlist);

        return PlaylistMapper.toDto(playlist);
    }

    public List<PlaylistDto> deletePlaylist(String idUser, String playlistId, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        Playlist playlist = playlistRepository.findByIdPlaylist(playlistId)
                .orElseThrow(() -> new PlaylistNotFoundException("No playlist found with the id : " + playlistId));

        if(!playlistRepository.existsByIdPlaylistAndUser(playlistId, user)){
            throw new ResourceOwnershipException("Playlist with ID " + playlistId + " does not belong to the user " + user.getActualUsername());
        }

        user.getPlaylists().remove(playlist);
        userRepository.save(user);

        for (Movie movie : playlist.getMovies()) {
            movie.getPlaylists().remove(playlist);
            movieRepository.save(movie);
        }

        playlistRepository.delete(playlist);

        return user.getPlaylists().stream().map(PlaylistMapper::toDto).toList();
    }

    public MovieDto addMovieToPlaylist(String idUser, String playlistId, MovieDto movieDto, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        Movie movie = movieService.saveMovieOrReturnExisting(movieDto);

        Playlist playlist = playlistRepository.findByIdPlaylist(playlistId)
                .orElseThrow(() -> new PlaylistNotFoundException("No playlist found with the id : " + playlistId));

        if(!playlistRepository.existsByIdPlaylistAndUser(playlistId, user)){
            throw new ResourceOwnershipException("Playlist with ID " + playlistId + " does not belong to the user " + user.getActualUsername());
        }

        boolean isMoviePresentInPlaylist = playlist.getMovies().stream()
                .anyMatch(m -> m.getTmdbIdMovie().equals(movie.getTmdbIdMovie()));

        if(isMoviePresentInPlaylist) {
            throw new ResourceOwnershipException("Playlist with ID " + playlistId + " already has a movie with the TMDB id " + movie.getTmdbIdMovie());
        }

        movie.getPlaylists().add(playlist);
        movieRepository.save(movie);

        playlist.getMovies().add(movie);
        playlistRepository.save(playlist);

        return MovieMapper.toDto(movie);
    }

    public List<MovieDto> deleteMovieFromPlaylist(String idUser, String playlistId, Long tmdbIdMovie, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        Movie movie = movieRepository.findByTmdbIdMovie(tmdbIdMovie)
                .orElseThrow(() -> new MovieNotFoundException("No movie found with TMDB id: " + tmdbIdMovie));

        Playlist playlist = playlistRepository.findByIdPlaylist(playlistId)
                .orElseThrow(() -> new PlaylistNotFoundException("No playlist found with the id : " + playlistId));

        if(!playlistRepository.existsByIdPlaylistAndUser(playlistId, user)){
            throw new ResourceOwnershipException("Playlist with ID " + playlistId + " does not belong to the user " + user.getActualUsername());
        }

        boolean isMoviePresentInPlaylist = playlist.getMovies().stream()
                .anyMatch(m -> m.getTmdbIdMovie().equals(tmdbIdMovie));

        if(!isMoviePresentInPlaylist) {
            throw new ResourceOwnershipException("Playlist with ID " + playlistId + " does not have a movie with the TMDB id " + movie.getTmdbIdMovie());
        }

        playlist.getMovies().remove(movie);
        playlistRepository.save(playlist);
        movie.getPlaylists().remove(playlist);
        movieRepository.save(movie);

        return playlist.getMovies().stream().map(MovieMapper::toDto).toList();
    }



}
