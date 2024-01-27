package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.dto.UserDto;
import com.example.filmfoliobackend.exception.DuplicateResourceException;
import com.example.filmfoliobackend.exception.MovieNotFoundException;
import com.example.filmfoliobackend.exception.UserNotFoundException;
import com.example.filmfoliobackend.mapper.MovieMapper;
import com.example.filmfoliobackend.mapper.UserMapper;
import com.example.filmfoliobackend.model.Movie;
import com.example.filmfoliobackend.model.Playlist;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.model.enums.Role;
import com.example.filmfoliobackend.repository.MovieRepository;
import com.example.filmfoliobackend.repository.PlaylistRepository;
import com.example.filmfoliobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final PlaylistRepository playlistRepository;

    public List<UserDto> getAllUsers() {
        List<User> allUsers = userRepository.findAll();
        List<UserDto> allUsersDto = allUsers.stream().map(UserMapper::toDto).toList();

        return allUsersDto;
    }

    public UserDto changeUserPrivileges(String idUser, Role newRole) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        user.setRoles(Collections.singleton(newRole));
        userRepository.save(user);

        return UserMapper.toDto(user);
    }

    public MovieDto createMovie(MovieDto movieDto) {
        Movie movie = MovieMapper.toDocument(movieDto);
        movie.setIsCustom(true);

        movieRepository.save(movie);

        return MovieMapper.toDto(movie);        //TODO sprawdź czy będzie działało bez podania tmdb id
    }

    public MovieDto updateMovieInfo(String movieId, MovieDto updatedMovieDto) {            //TODO na Froncie zablokuj zmianę Tmdb id
        Movie movie = movieRepository.findByIdMovie(movieId)
                .orElseThrow(() -> new MovieNotFoundException("No movie found with the id: " + movieId));

        movie.setTitle(updatedMovieDto.getTitle());
        movie.setOverview(updatedMovieDto.getOverview());
        movie.setReleaseDate(updatedMovieDto.getReleaseDate());
        movie.setRuntime(updatedMovieDto.getRuntime());
        movie.setAdult(updatedMovieDto.getAdult());

        movieRepository.save(movie);

        return MovieMapper.toDto(movie);        //TODO sprawdź czy będzie działało bez podania tmdb id
    }

    public void deleteMovie(String movieId) {
        Movie movie = movieRepository.findByIdMovie(movieId)
                .orElseThrow(() -> new MovieNotFoundException("No movie found with the id: " + movieId));

        // Usuwanie filmu z watchlist użytkowników
        List<User> usersWithMovie = userRepository.findAllByWatchlistContaining(movie);
        for (User user : usersWithMovie) {
            user.getWatchlist().remove(movie);
            userRepository.save(user);
        }

        // Usuwanie filmu z playlist
        List<Playlist> playlistsContainingMovie = playlistRepository.findAllByMoviesContaining(movie);
        for (Playlist playlist : playlistsContainingMovie) {
            playlist.getMovies().remove(movie);
            playlistRepository.save(playlist);
        }

        movieRepository.delete(movie);
    }

    //TODO zaimplementować obsługę sytuacji, gdy próbuje uzyskać dostęp do nieistniejących już dokumentów (np. poprzez ignorowanie ich, zwracanie odpowiednich komunikatów błędów itp.).
}
