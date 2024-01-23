package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.exception.UserNotFoundException;
import com.example.filmfoliobackend.mapper.GenreMapper;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.repository.UserRepository;
import com.example.filmfoliobackend.response.TMDBResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final RestTemplate restTemplate;
    private final WatchlistService watchlistService;
    private final UserRepository userRepository;
    @Value("${tmdb.api.key}")
    private String apiKey;
    @Value("${tmdb.api.url}")
    private String apiUrl;


    public List<MovieDto> getRecommendations(String idUser) {
        // Przygotowanie identyfikatorów gatunków jako ciągów znaków
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));
        List<GenreDto> preferences = user.getPreferences().stream().map(GenreMapper::toDto).toList();

        String popularGenresString = prepareGenresString(watchlistService.getPopularGenresFromWatchlistMovies(idUser));
        String preferencesString = prepareGenresString(preferences);

        // Zapytanie dla popularGenresFromWatchlistMovies
        List<MovieDto> moviesFromPopularGenres = queryTMDB(popularGenresString);

        // Zapytanie dla preferences
        List<MovieDto> moviesFromPreferences = queryTMDB(preferencesString);

        // Połączenie wyników (zakładając, że chcemy unikalne wyniki)
        return Stream.concat(moviesFromPopularGenres.stream(), moviesFromPreferences.stream())
                .distinct()
                .toList();
    }

    private String prepareGenresString(List<GenreDto> genres) {
        return genres.stream()
                .map(GenreDto::getTmdbIdGenre)
                .map(String::valueOf)
                .collect(Collectors.joining(","));
    }

    private List<MovieDto> queryTMDB(String genresString) {
        // Przykładowe zapytanie do TMDB, zwróć listę filmów na podstawie genresString
        String url = String.format("%s/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=%s&page=1&api_key=%s",
                apiUrl, genresString, apiKey);
        // Wykonaj zapytanie i przetwórz odpowiedź

        ResponseEntity<TMDBResponse> response = restTemplate.getForEntity(url, TMDBResponse.class);
        if(response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody().getResults();
        } else {
            return Collections.emptyList();
        }
    }
}
