package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.exception.ExternalServiceException;
import com.example.filmfoliobackend.exception.GenreNotFoundException;
import com.example.filmfoliobackend.exception.UserNotFoundException;
import com.example.filmfoliobackend.mapper.GenreMapper;
import com.example.filmfoliobackend.model.Genre;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.repository.GenreRepository;
import com.example.filmfoliobackend.repository.UserRepository;
import com.example.filmfoliobackend.response.GenresResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GenreService {
    private final RestTemplate restTemplate;
    private final GenreRepository genreRepository;

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

        List<GenreDto> genreDtos = response.getBody().getGenres();

        genreDtos.forEach(g -> {
            if(!genreRepository.existsByTmdbIdGenre(g.getTmdbIdGenre())) {
                genreRepository.save(GenreMapper.toDocument(g));
            }
        });

        return genreDtos;
    }

    public List<Genre> getGenresIfExists(List<GenreDto> genreDtos) {
        return genreDtos.stream().map(g -> {
            var optionalGenre = genreRepository.findByTmdbIdGenre(g.getTmdbIdGenre());
            if(optionalGenre.isPresent()) {
                return optionalGenre.get();
            }
            throw new GenreNotFoundException("No genre found with name"+ g.getName());
        }).toList();
    }

}
