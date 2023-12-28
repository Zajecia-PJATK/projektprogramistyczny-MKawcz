package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tmdb/movies")
@RequiredArgsConstructor
public class MovieController {
    private final MovieService movieService;

    @GetMapping("/popular")
    public ResponseEntity<List<MovieDto>> getPopularMovies() {
        List<MovieDto> popularMovies = movieService.getPopularMovies();
        return ResponseEntity.ok(popularMovies);
    }
}

