package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.dto.ReviewDto;
import com.example.filmfoliobackend.response.TMDBResponse;
import com.example.filmfoliobackend.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/tmdb/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {
    private final MovieService movieService;

    @GetMapping("/popular")
    public CompletableFuture<ResponseEntity<List<MovieDto>>> getPopularMovies() {
        return movieService.getPopularMovies()
                .thenApply(ResponseEntity::ok);
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
    public CompletableFuture<ResponseEntity<List<MovieDto>>> searchMoviesByTitle(@RequestParam String query, @RequestParam Boolean includeAdult, @RequestParam String primaryReleaseDate) {
        return movieService.searchMovies(query, includeAdult, primaryReleaseDate)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/custom")
    public ResponseEntity<List<MovieDto>> getCustomMovies() {
        List<MovieDto> customMovies = movieService.getCustomMovies();
        return ResponseEntity.ok(customMovies);
    }

    @GetMapping("/discover")
    public CompletableFuture<ResponseEntity<TMDBResponse>> discoverMovies(
            @RequestParam(required = false) String language,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "popularity.desc") String sortBy,
            @RequestParam(required = false, defaultValue = "false") Boolean includeAdult,
            @RequestParam(required = false, defaultValue = "false") Boolean includeVideo,
            @RequestParam(required = false) Integer primaryReleaseYear,
            @RequestParam(required = false) String withGenres
    ) {

        return movieService.discoverMovies(
                        language,
                        page,
                        sortBy,
                        includeAdult,
                        includeVideo,
                        primaryReleaseYear,
                        withGenres
                )
                .thenApply(ResponseEntity::ok);
    }
}

