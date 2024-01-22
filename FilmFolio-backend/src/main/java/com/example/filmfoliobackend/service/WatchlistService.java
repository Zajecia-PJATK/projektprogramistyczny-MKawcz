package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.exception.MovieNotFoundException;
import com.example.filmfoliobackend.exception.ResourceOwnershipException;
import com.example.filmfoliobackend.exception.UserNotFoundException;
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

    public List<MovieDto> getUserWatchlist(String idUser) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        List<MovieDto> watchlistDto = user.getWatchlist().stream().map(MovieMapper::toDto).toList();

        return watchlistDto;
    }

    public List<MovieDto> addMovieToWatchlist(String idUser, MovieDto movieDto) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        Movie movie = movieRepository.findByTmdbIdMovie(movieDto.getTmdbIdMovie())
                .orElseGet(() -> MovieMapper.toDocument(movieDto));

        boolean isMoviePresentInUserWatchlist = user.getWatchlist().stream()
                .anyMatch(m -> m.getTmdbIdMovie().equals(movie.getTmdbIdMovie()));

        if(isMoviePresentInUserWatchlist) {
            throw new ResourceOwnershipException("Movie with TMDB id " + movie.getTmdbIdMovie() + " is already in the watchlist of user " + user.getActualUsername());
        }

        movie.getUsers().add(user);
        movieRepository.save(movie);

        user.getWatchlist().add(movie);
        userRepository.save(user);

        return getUserWatchlist(idUser);
    }

    public List<MovieDto> deleteMovieFromWatchlist(String idUser, Long tmdbIdMovie) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        Movie movie = movieRepository.findByTmdbIdMovie(tmdbIdMovie)
                .orElseThrow(() -> new MovieNotFoundException("No movie found with TMDB id: " + tmdbIdMovie));

//        if(!userRepository.existsByIdUserAndWatchlistTmdbIdMovie(user.getIdUser(), tmdbIdMovie)) {
//            throw new RuntimeException("Movie with the given TMDB id doesn't belong to the watchlist of the users with the given id");
//        }

        boolean isMoviePresentInUserWatchlist = user.getWatchlist().stream()
                .anyMatch(m -> m.getTmdbIdMovie().equals(tmdbIdMovie));

        if(!isMoviePresentInUserWatchlist) {
            throw new ResourceOwnershipException("Movie with TMDB id " + movie.getTmdbIdMovie() + " is not the watchlist of the user " + user.getActualUsername());
        }

        user.getWatchlist().remove(movie);
        movie.getUsers().remove(user);

        userRepository.save(user);
        movieRepository.save(movie);

        return getUserWatchlist(idUser);
    }

}
