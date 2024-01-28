package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.exception.MovieNotFoundException;
import com.example.filmfoliobackend.exception.ResourceOwnershipException;
import com.example.filmfoliobackend.exception.UserNotFoundException;
import com.example.filmfoliobackend.mapper.MovieMapper;
import com.example.filmfoliobackend.model.Movie;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.repository.GenreRepository;
import com.example.filmfoliobackend.repository.MovieRepository;
import com.example.filmfoliobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WatchlistService {
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final MovieService movieService;

    public List<MovieDto> getUserWatchlist(String idUser, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        List<MovieDto> watchlistDto = user.getWatchlist().stream().map(MovieMapper::toDto).toList();

        return watchlistDto;
    }

    public List<MovieDto> addMovieToWatchlist(String idUser, MovieDto movieDto, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        Movie movie = movieService.saveMovieOrReturnExisting(movieDto);


        boolean isMoviePresentInUserWatchlist = user.getWatchlist().stream()
                .anyMatch(m -> m.getTmdbIdMovie().equals(movie.getTmdbIdMovie()));

        if(isMoviePresentInUserWatchlist) {
            throw new ResourceOwnershipException("Movie with TMDB id " + movie.getTmdbIdMovie() + " is already in the watchlist of user " + user.getActualUsername());
        }

        movie.getUsers().add(user);
        movieRepository.save(movie);

        user.getWatchlist().add(movie);

        user.setWatchedMoviesCount(user.getWatchedMoviesCount() + 1);
        if (movie.getRuntime() != null) {
            user.setTotalWatchTime(user.getTotalWatchTime() + movie.getRuntime());
        }
        String currentMonth = YearMonth.now().toString();
        user.getMonthlyWatchStats().merge(currentMonth, 1, Integer::sum);
        userRepository.save(user);

        return user.getWatchlist().stream().map(MovieMapper::toDto).toList();
    }

    public List<MovieDto> deleteMovieFromWatchlist(String idUser, Long tmdbIdMovie, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        Movie movie = movieRepository.findByTmdbIdMovie(tmdbIdMovie)
                .orElseThrow(() -> new MovieNotFoundException("No movie found with TMDB id: " + tmdbIdMovie));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        boolean isMoviePresentInUserWatchlist = user.getWatchlist().stream()
                .anyMatch(m -> m.getTmdbIdMovie().equals(tmdbIdMovie));

        if(!isMoviePresentInUserWatchlist) {
            throw new ResourceOwnershipException("Movie with TMDB id " + movie.getTmdbIdMovie() + " is not the watchlist of the user " + user.getActualUsername());
        }

        user.getWatchlist().remove(movie);
        movie.getUsers().remove(user);

        user.setWatchedMoviesCount(Math.max(user.getWatchedMoviesCount() - 1, 0));
        if (movie.getRuntime() != null) {
            user.setTotalWatchTime(Math.max(user.getTotalWatchTime() - movie.getRuntime(), 0));
        }
        String currentMonth = YearMonth.now().toString();
        user.getMonthlyWatchStats().computeIfPresent(currentMonth, (key, value) -> value > 1 ? value - 1 : null);


        userRepository.save(user);
        movieRepository.save(movie);

        return user.getWatchlist().stream().map(MovieMapper::toDto).toList();
    }

    public List<GenreDto> getPopularGenresFromWatchlistMovies(String idUser, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        List<GenreDto> genreDtos = new ArrayList<>();
        getUserWatchlist(idUser, authentication).forEach(m -> genreDtos.addAll(m.getGenres()));

        List<GenreDto> top3Genres = genreDtos.stream()
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting())) // Zlicza wystąpienia
                .entrySet().stream()
                .sorted(Map.Entry.<GenreDto, Long>comparingByValue().reversed()) // Sortuje według liczby wystąpień
                .limit(3) // Bierze tylko 3 najczęstsze
                .map(Map.Entry::getKey).toList();
        return top3Genres;
    }

}
