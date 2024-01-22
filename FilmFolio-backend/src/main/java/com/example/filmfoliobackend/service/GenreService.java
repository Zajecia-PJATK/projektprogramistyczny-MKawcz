package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.exception.ExternalServiceException;
import com.example.filmfoliobackend.repository.GenreRepository;
import com.example.filmfoliobackend.response.GenresResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreService {
    private final RestTemplate restTemplate;
    @Value("${tmdb.api.key}")
    private String apiKey;
    @Value("${tmdb.api.url}")
    private String apiUrl;

    public List<GenreDto> getMovieGenres() {
        String url = String.format("%s/genre/movie/list?language=en&api_key=%s", apiUrl, apiKey);
        ResponseEntity<GenresResponse> response = restTemplate.getForEntity(url, GenresResponse.class);

        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new ExternalServiceException("Failed to retrieve movie genres from TMDB");
        }

        return response.getBody().getGenres();
    }
}
