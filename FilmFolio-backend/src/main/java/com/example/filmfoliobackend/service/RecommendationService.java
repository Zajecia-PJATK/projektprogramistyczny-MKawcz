package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.exception.UserNotFoundException;
import com.example.filmfoliobackend.mapper.GenreMapper;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.repository.UserRepository;
import com.example.filmfoliobackend.response.TMDBResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final WebClient.Builder webClientBuilder;
    private final RestTemplate restTemplate;
    private final WatchlistService watchlistService;
    private final UserRepository userRepository;
    @Value("${tmdb.api.key}")
    private String apiKey;
    @Value("${tmdb.api.url}")
    private String apiUrl;

    Logger logger = LoggerFactory.getLogger(RecommendationService.class);

//    Metoda getRecommendations w RecommendationService:
//    Ta metoda rozpoczyna się od synchronicznego pobrania danych użytkownika i jego preferencji.
//    Następnie, asynchronicznie wykonuje dwa zapytania do zewnętrznego API (TMDB) wykorzystując queryTMDB,
//    które zwraca CompletableFuture<List<MovieDto>>. To zachowanie jest podobne do rozpoczynania
//    asynchronicznych operacji w obietnicach.
//    Używa CompletableFuture.allOf do oczekiwania na zakończenie obu asynchronicznych operacji,
//    co jest analogiczne do Promise.all w JavaScript.
//    thenApply jest wykorzystywane do przetworzenia wyników po zakończeniu wszystkich asynchronicznych
//    operacji. Jest to podobne do użycia .then w obietnicach.

    public CompletableFuture<List<MovieDto>> getRecommendations(String idUser, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        List<GenreDto> preferences = user.getPreferences().stream()
                .map(GenreMapper::toDto)
                .toList();

        String popularGenresString = prepareGenresString(watchlistService.getPopularGenresFromWatchlistMovies(idUser, authentication));
        String preferencesString = prepareGenresString(preferences);

        logger.info("Fetching recommendations for user ID: {} - Thread ID: {}", idUser, Thread.currentThread().getId());

        CompletableFuture<List<MovieDto>> moviesFromPopularGenres = queryTMDB(popularGenresString);
        CompletableFuture<List<MovieDto>> moviesFromPreferences = queryTMDB(preferencesString);

        return CompletableFuture.allOf(moviesFromPopularGenres, moviesFromPreferences)
                .thenApply(voidd -> {
                    try {
                        List<MovieDto> moviesFromPopularGenresList = moviesFromPopularGenres.get();
                        List<MovieDto> moviesFromPreferencesList = moviesFromPreferences.get();

                        logger.info("Combining results for user ID: {} - Thread ID: {}", idUser, Thread.currentThread().getId());

                        return Stream.concat(moviesFromPopularGenresList.stream(), moviesFromPreferencesList.stream())
                                .distinct()
                                .collect(Collectors.toList());
                    } catch (Exception e) {
                        logger.error("Error occurred while fetching recommendations for user ID: {}", idUser, e);
                        return Collections.emptyList();
                    }
                });
    }

    public String prepareGenresString(List<GenreDto> genres) {
        return genres.stream()
                .map(GenreDto::getTmdbIdGenre)
                .map(String::valueOf)
                .collect(Collectors.joining(","));
    }

//    Metoda queryTMDB:
//    Używa WebClient do asynchronicznego wykonania zapytania HTTP, co jest równoważne wykorzystaniu
//    fetch w JavaScript.
//    bodyToMono(TMDBResponse.class).toFuture()
//    konwertuje odpowiedź na CompletableFuture, co jest podobne do zwracania nowej obietnicy w JavaScript.

    public CompletableFuture<List<MovieDto>> queryTMDB(String genresString) {
        WebClient webClient = webClientBuilder.baseUrl(apiUrl).build();
        String url = String.format("/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_genres=%s&api_key=%s",
                genresString, apiKey);

        logger.info("Starting TMDB query for genres: {} - Thread ID: {}", genresString, Thread.currentThread().getId());

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(TMDBResponse.class)
                .map(TMDBResponse::getResults)
                .doOnSuccess(movies -> logger.info("Completed TMDB query for genres: {} - Thread ID: {}", genresString, Thread.currentThread().getId()))
                .toFuture();
    }
}
