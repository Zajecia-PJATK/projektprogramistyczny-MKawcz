package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.repository.MovieRepository;
import com.example.filmfoliobackend.response.TMDBResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {
    private final RestTemplate restTemplate;
    private final MovieRepository movieRepository;
    @Value("${tmdb.api.key}")
    private String apiKey;
    @Value("${tmdb.api.url}")
    private String apiUrl;

    public List<MovieDto> getPopularMovies() {
        String url = String.format("%s/movie/popular?language=en-US&page=1&api_key=%s", apiUrl, apiKey);
        TMDBResponse response = restTemplate.getForObject(url, TMDBResponse.class);
        return response != null ? response.getResults() : List.of();
    }
}
