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
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No user found with username: " + username));


        List<MovieDto> watchlistDto = user.getWatchlist().stream().map(MovieMapper::toDto).toList();

        return watchlistDto;
    }

    public List<MovieDto> addMovieToWatchlist(String username, MovieDto movieDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No user found with username: " + username));

        Movie movie = movieRepository.findByTmdbIdMovie(movieDto.getTmdbIdMovie())
                .orElseGet(() -> MovieMapper.toDocument(movieDto));

        movie.getUsers().add(user);
        movieRepository.save(movie);

        user.getWatchlist().add(movie);
        userRepository.save(user);


        return getUserWatchlist(username);
    }

    public List<MovieDto> deleteMovieFromWatchlist(String username, Long tmdbIdMovie) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No user found with username: " + username));

        Movie movie = movieRepository.findByTmdbIdMovie(tmdbIdMovie)
                .orElseThrow(() -> new RuntimeException("No user found with TMDB id: " + tmdbIdMovie));

        if(!userRepository.existsByIdUserAndWatchlistTmdbIdMovie(user.getIdUser(), tmdbIdMovie)) {
            throw new RuntimeException("Movie with the given TMDB id doesn't belong to the watchlist of the users with the given id");
        }

        user.getWatchlist().remove(movie);
        movie.getUsers().remove(user);

        userRepository.save(user);
        movieRepository.save(movie);

        return getUserWatchlist(username);
    }

}
