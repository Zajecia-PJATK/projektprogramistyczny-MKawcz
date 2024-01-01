package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.service.WatchlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchlistController {
    private final WatchlistService watchlistService;

    @GetMapping
    public ResponseEntity<List<MovieDto>> getUserWatchlist(@RequestParam String username) {
        List<MovieDto> userWatchlist = watchlistService.getUserWatchlist(username);
        return ResponseEntity.ok(userWatchlist);
    }

    @PostMapping
    public ResponseEntity<List<MovieDto>> addMovieToWatchlist(@RequestParam String username, @RequestBody MovieDto movieDto) {
        List<MovieDto> userWatchlist = watchlistService.addMovieToWatchlist(username, movieDto);
        return ResponseEntity.ok(userWatchlist);
    }

    @DeleteMapping("/{tmdbIdMovie}")
    public ResponseEntity<List<MovieDto>> deleteMovieFromWatchlist(@RequestParam String username, @PathVariable Long tmdbIdMovie) {
        List<MovieDto> userWatchlist = watchlistService.deleteMovieFromWatchlist(username, tmdbIdMovie);
        return ResponseEntity.ok(userWatchlist);
    }
}
