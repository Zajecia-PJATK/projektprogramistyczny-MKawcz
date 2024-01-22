package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.dto.ReviewDto;
import com.example.filmfoliobackend.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tmdb/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {
    private final MovieService movieService;

    @GetMapping("/popular")
    public ResponseEntity<List<MovieDto>> getPopularMovies() {
        List<MovieDto> popularMovies = movieService.getPopularMovies();
        return ResponseEntity.ok(popularMovies);
    }

    @GetMapping("/{idMovie}")
    public ResponseEntity<MovieDto> getMovie(@PathVariable Long idMovie) {
        MovieDto movieDto = movieService.getMovie(idMovie);
        return ResponseEntity.ok(movieDto);
    }

    @GetMapping("/custom/{idMovie}")
    public ResponseEntity<MovieDto> getMovieByIdMovie(@PathVariable String idMovie) {
        MovieDto movieDto = movieService.getMovieByIdMovie(idMovie);
        return ResponseEntity.ok(movieDto);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MovieDto>> searchMoviesByTitle(@RequestParam String query, @RequestParam Boolean includeAdult) {
        List<MovieDto> searchResults = movieService.searchMoviesByTitle(query, includeAdult);
        return ResponseEntity.ok(searchResults);
    }

    @GetMapping("/custom")
    public ResponseEntity<List<MovieDto>> getCustomMovies() {
        List<MovieDto> customMovies = movieService.getCustomMovies();
        return ResponseEntity.ok(customMovies);
    }
}

