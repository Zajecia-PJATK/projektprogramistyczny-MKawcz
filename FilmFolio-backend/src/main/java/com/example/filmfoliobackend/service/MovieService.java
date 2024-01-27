package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.exception.ExternalServiceException;
import com.example.filmfoliobackend.exception.InvalidRequestException;
import com.example.filmfoliobackend.exception.MovieNotFoundException;
import com.example.filmfoliobackend.exception.ResourceNotFoundException;
import com.example.filmfoliobackend.mapper.MovieMapper;
import com.example.filmfoliobackend.model.Genre;
import com.example.filmfoliobackend.model.Movie;
import com.example.filmfoliobackend.repository.MovieRepository;
import com.example.filmfoliobackend.response.TMDBResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MovieService {

    Logger logger = LoggerFactory.getLogger(MovieService.class);
    private final RestTemplate restTemplate;
    private final MovieRepository movieRepository;
    private final GenreService genreService;

    @Value("${tmdb.api.key}")
    private String apiKey;
    @Value("${tmdb.api.url}")
    private String apiUrl;

    @Async("taskExecutor")
    public CompletableFuture<List<MovieDto>> getPopularMovies() {      //TODO można dodać zmianę page
        return CompletableFuture.supplyAsync(() -> {
            String url = String.format("%s/movie/popular?language=en-US&page=1&api_key=%s", apiUrl, apiKey);
            ResponseEntity<TMDBResponse> response = restTemplate.getForEntity(url, TMDBResponse.class);

            if(response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                throw new ExternalServiceException("Field to retrieve popular movies from TMDB");
            }

            return response.getBody().getResults();
        }).exceptionally(handleException("Failed to retrieve popular movies"));
    }

    public MovieDto getMovie(Long tmdbIdMovie) {
        String url = String.format("%s/movie/%d?language=en-US&api_key=%s", apiUrl, tmdbIdMovie, apiKey);
        ResponseEntity<MovieDto> response = restTemplate.getForEntity(url, MovieDto.class);

        if(response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new ResourceNotFoundException("No movie found with the TMDB id: " + tmdbIdMovie);
        }

        return response.getBody();
    }

    public MovieDto getMovieByIdMovie(String idMovie) {
        Movie movie = movieRepository.findByIdMovie(idMovie)
                .orElseThrow(() -> new MovieNotFoundException("No movie with id: " + idMovie));

        return MovieMapper.toDto(movie);
    }

    @Async("taskExecutor")
    public CompletableFuture<List<MovieDto>> searchMovies(String query, Boolean includeAdult, String primaryReleaseDate) {
        return CompletableFuture.supplyAsync(() -> {
            String url = String.format("%s/search/movie?query=%s&include_adult=%b&language=en-US&primary_release_year=%s&page=1&api_key=%s", apiUrl, query, includeAdult, primaryReleaseDate, apiKey);
            ResponseEntity<TMDBResponse> response = restTemplate.getForEntity(url, TMDBResponse.class);

            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                throw new InvalidRequestException("Query string cannot be empty");
            }

            return response.getBody().getResults();
        }).exceptionally(handleException("No results for given query"));
    }

    @Async("taskExecutor")
    public CompletableFuture<TMDBResponse> discoverMovies (
            String language,
            Integer page,
            String sortBy,
            Boolean includeAdult,
            Boolean includeVideo,
            Integer primaryReleaseYear,
            String withGenres
    ) {
        return CompletableFuture.supplyAsync(() -> {
            // Budowanie URL z użyciem parametrów
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(String.format("%s/discover/movie", apiUrl))
                    .queryParam("api_key", apiKey)
                    .queryParam("language", language)
                    .queryParam("page", page)
                    .queryParam("sort_by", sortBy)
                    .queryParam("include_adult", includeAdult)
                    .queryParam("include_video", includeVideo)
                    .queryParam("primary_release_year", primaryReleaseYear)
                    .queryParam("with_genres", withGenres);
            String url = builder.toUriString();

            logger.info(url);
            // Wykonywanie zapytania do TMDB i przetwarzanie odpowiedzi
            ResponseEntity<TMDBResponse> response = restTemplate.getForEntity(url, TMDBResponse.class);

            if(response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                throw new ExternalServiceException("Failed to discover movies from TMDB");
            }

            return response.getBody();
        }).exceptionally(handleException("Failed to discover movies"));
    }

    public List<MovieDto> getCustomMovies() {
        List<Movie> allByIsCustomTrue = movieRepository.findAllByIsCustomTrue();
        List<MovieDto> customMovies = allByIsCustomTrue.stream().map(MovieMapper::toDto).toList();

        return customMovies;
    }

    public Movie saveMovieOrReturnExisting(MovieDto dto) {
        Movie movie = movieRepository.findByTmdbIdMovie(dto.getTmdbIdMovie())
                .orElseGet(() -> MovieMapper.toDocument(dto));

        List<Genre> genresIfExists = genreService.getGenresIfExists(dto.getGenres());
        movie.setGenres(genresIfExists);

        return movieRepository.save(movie);
    }

    private <T> Function<Throwable, T> handleException(String message) {
        return throwable -> {
            throw new ExternalServiceException(message);
        };
    }

}
