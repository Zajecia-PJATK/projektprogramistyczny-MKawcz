package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.service.WatchlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class WatchlistController {
    private final WatchlistService watchlistService;

    @GetMapping
    public ResponseEntity<List<MovieDto>> getUserWatchlist(@RequestParam String idUser, Authentication authentication) {
        List<MovieDto> userWatchlist = watchlistService.getUserWatchlist(idUser, authentication);
        return ResponseEntity.ok(userWatchlist);
    }

    @PostMapping
    public ResponseEntity<List<MovieDto>> addMovieToWatchlist(@RequestParam String idUser, @RequestBody @Valid MovieDto movieDto, Authentication authentication) {
        List<MovieDto> userWatchlist = watchlistService.addMovieToWatchlist(idUser, movieDto, authentication);
        return ResponseEntity.ok(userWatchlist);
    }

    @DeleteMapping("/{tmdbIdMovie}")
    public ResponseEntity<List<MovieDto>> deleteMovieFromWatchlist(@RequestParam String idUser, @PathVariable Long tmdbIdMovie, Authentication authentication) {
        List<MovieDto> userWatchlist = watchlistService.deleteMovieFromWatchlist(idUser, tmdbIdMovie, authentication);
        return ResponseEntity.ok(userWatchlist);
    }

    @GetMapping("/popular/genres")
    public ResponseEntity<List<GenreDto>> getPopularGenresFromWatchlistMovies(@RequestParam String idUser, Authentication authentication) {
        List<GenreDto> popularGenresFromWatchlistMovies = watchlistService.getPopularGenresFromWatchlistMovies(idUser, authentication);
        return ResponseEntity.ok(popularGenresFromWatchlistMovies);
    }
}
