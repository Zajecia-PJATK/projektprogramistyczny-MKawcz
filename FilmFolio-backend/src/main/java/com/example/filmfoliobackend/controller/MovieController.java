package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{movieId}")
    public ResponseEntity<MovieDto> getMovie(@PathVariable Long movieId) {
        MovieDto movieDto = movieService.getMovie(movieId);
        return ResponseEntity.ok(movieDto);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MovieDto>> searchMoviesByTitle(@RequestParam String query, @RequestParam Boolean includeAdult) {
        List<MovieDto> searchResults = movieService.searchMoviesByTitle(query, includeAdult);
        return ResponseEntity.ok(searchResults);
    }


}

