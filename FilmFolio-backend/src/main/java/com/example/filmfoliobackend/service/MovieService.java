package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.exception.ExternalServiceException;
import com.example.filmfoliobackend.exception.InvalidRequestException;
import com.example.filmfoliobackend.exception.MovieNotFoundException;
import com.example.filmfoliobackend.exception.ResourceNotFoundException;
import com.example.filmfoliobackend.mapper.MovieMapper;
import com.example.filmfoliobackend.model.Movie;
import com.example.filmfoliobackend.repository.MovieRepository;
import com.example.filmfoliobackend.response.TMDBResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final RestTemplate restTemplate;
    private final MovieRepository movieRepository;

    @Value("${tmdb.api.key}")
    private String apiKey;
    @Value("${tmdb.api.url}")
    private String apiUrl;

    public List<MovieDto> getPopularMovies() {      //TODO można dodać zmianę page
        String url = String.format("%s/movie/popular?language=en-US&page=1&api_key=%s", apiUrl, apiKey);
        ResponseEntity<TMDBResponse> response = restTemplate.getForEntity(url, TMDBResponse.class);

        if(response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new ExternalServiceException("Failed to retrieve popular movies from TMDB");
        }
        return response.getBody().getResults();
    }

    public MovieDto getMovie(Long tmdbIdMovie) {
        String url = String.format("%s/movie/%d?language=en-US&api_key=%s", apiUrl, tmdbIdMovie, apiKey);
        ResponseEntity<MovieDto> response = restTemplate.getForEntity(url, MovieDto.class);

        if(response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new ResourceNotFoundException("No movie found with the TMDB id: " + tmdbIdMovie);
        }

        //TODO trzeba będzie tu dodać zamianę genre_ids i pobieranie ich po id, żeby je wyświetlić

        return response.getBody();
    }

    public MovieDto getMovieByIdMovie(String idMovie) {
        Movie movie = movieRepository.findByIdMovie(idMovie)
                .orElseThrow(() -> new MovieNotFoundException("No movie with id: " + idMovie));

        return MovieMapper.toDto(movie);
    }

    public List<MovieDto> searchMoviesByTitle(String query, Boolean includeAdult) {          //TODO można dodać resztę parametrów (language, primary_release_year, page, region, year)
        String url = String.format("%s/search/movie?query=%s&include_adult=%b&language=en-US&page=1&api_key=%s", apiUrl, query, includeAdult, apiKey);
        ResponseEntity<TMDBResponse> response = restTemplate.getForEntity(url, TMDBResponse.class);

        if(response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new InvalidRequestException("Query string cannot be empty");
        }

        return response.getBody().getResults();
    }

    public List<MovieDto> getCustomMovies() {
        List<Movie> allByIsCustomTrue = movieRepository.findAllByIsCustomTrue();
        List<MovieDto> customMovies = allByIsCustomTrue.stream().map(MovieMapper::toDto).toList();

        return customMovies;
    }
}
