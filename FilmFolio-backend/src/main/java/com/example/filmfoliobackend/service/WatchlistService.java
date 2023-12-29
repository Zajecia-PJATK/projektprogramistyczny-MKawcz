package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.mapper.MovieMapper;
import com.example.filmfoliobackend.model.Movie;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.repository.MovieRepository;
import com.example.filmfoliobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WatchlistService {
    private final UserRepository userRepository;

    private final MovieRepository movieRepository;

    public List<MovieDto> getUserWatchlist(String username) {
        var optionalUser = userRepository.findByUsername(username);

        if(optionalUser.isEmpty()) {
            throw new RuntimeException("No user with the given username");
        }

        User user = optionalUser.get();

        List<MovieDto> mappedMovieDtos = user.getWatchlist().stream().map(MovieMapper::toDto).toList();

        return mappedMovieDtos;
    }

    public List<MovieDto> addMovieToWatchlist(String username, MovieDto movieDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No user found with username: " + username));

        Movie movie = movieRepository.findByTmdbIdMovie(movieDto.getTmdbIdMovie())
                .orElseGet(() -> MovieMapper.toDocument(movieDto));

        user.getWatchlist().add(movie);
        movie.getUsers().add(user);

        userRepository.save(user);
        movieRepository.save(movie);

        return getUserWatchlist(username);
    }

    public List<MovieDto> deleteMovieFromWatchlist(String username, String movieId) {
        var optionalUser = userRepository.findByUsername(username);
        var optionalMovie = movieRepository.findByIdMovie(movieId);

        if(optionalUser.isEmpty()) {
            throw new RuntimeException("No user with the given username");
        }

        if(optionalMovie.isEmpty()) {
            throw new RuntimeException("No movie with the given id");
        }

        User user = optionalUser.get();
        Movie movie = optionalMovie.get();

        user.getWatchlist().remove(movie);
        movie.getUsers().remove(user);

        userRepository.save(user);
        movieRepository.save(movie);

        return getUserWatchlist(username);
    }

}
