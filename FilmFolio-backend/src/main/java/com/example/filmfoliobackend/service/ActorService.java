package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.ActorDto;
import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.exception.ExternalServiceException;
import com.example.filmfoliobackend.response.ActorResponse;
import com.example.filmfoliobackend.response.GenresResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActorService {
    private final RestTemplate restTemplate;

    @Value("${tmdb.api.key}")
    private String apiKey;
    @Value("${tmdb.api.url}")
    private String apiUrl;

    public List<ActorDto> getMovieCast(Long tmdbIdMovie) {
        String url = String.format("%s/movie/%d/credits?language=en-US&api_key=%s", apiUrl, tmdbIdMovie, apiKey);
        ResponseEntity<ActorResponse> response = restTemplate.getForEntity(url, ActorResponse.class);

        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new ExternalServiceException("Failed to retrieve movie cast from TMDB");
        }

        return response.getBody().getCast();
    }
}
