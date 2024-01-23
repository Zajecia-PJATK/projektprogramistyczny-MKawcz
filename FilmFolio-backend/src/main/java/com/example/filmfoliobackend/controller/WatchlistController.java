package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.service.WatchlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class WatchlistController {
    private final WatchlistService watchlistService;

    @GetMapping
    public ResponseEntity<List<MovieDto>> getUserWatchlist(@RequestParam String idUser) {
        List<MovieDto> userWatchlist = watchlistService.getUserWatchlist(idUser);
        return ResponseEntity.ok(userWatchlist);
    }

    @PostMapping
    public ResponseEntity<List<MovieDto>> addMovieToWatchlist(@RequestParam String idUser, @RequestBody @Valid MovieDto movieDto) {
        List<MovieDto> userWatchlist = watchlistService.addMovieToWatchlist(idUser, movieDto);
        return ResponseEntity.ok(userWatchlist);
    }

    @DeleteMapping("/{tmdbIdMovie}")
    public ResponseEntity<List<MovieDto>> deleteMovieFromWatchlist(@RequestParam String idUser, @PathVariable Long tmdbIdMovie) {
        List<MovieDto> userWatchlist = watchlistService.deleteMovieFromWatchlist(idUser, tmdbIdMovie);
        return ResponseEntity.ok(userWatchlist);
    }

    @GetMapping("/popular/genres")
    public ResponseEntity<List<GenreDto>> getPopularGenresFromWatchlistMovies(@RequestParam String idUser) {
        List<GenreDto> popularGenresFromWatchlistMovies = watchlistService.getPopularGenresFromWatchlistMovies(idUser);
        return ResponseEntity.ok(popularGenresFromWatchlistMovies);
    }
}
