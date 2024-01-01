package com.example.filmfoliobackend.controller;


import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.dto.PlaylistDto;
import com.example.filmfoliobackend.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {
    private final PlaylistService playlistService;

    @GetMapping
    public ResponseEntity<List<PlaylistDto>> getPlaylists(@RequestParam String username) {
        List<PlaylistDto> playlists = playlistService.getPlaylists(username);
        return ResponseEntity.ok(playlists);
    }

    @PostMapping
    public ResponseEntity<PlaylistDto> createPlaylist(@RequestParam String username, @RequestBody PlaylistDto playlistDto) {
        PlaylistDto playlist = playlistService.createPlaylist(username, playlistDto);
        return ResponseEntity.ok(playlist);
    }

    @PutMapping("/{playlistId}")
    public ResponseEntity<PlaylistDto> updatePlaylist(@RequestParam String username, @PathVariable String playlistId , @RequestBody PlaylistDto playlistDto) {
        PlaylistDto updatedPlaylistDto = playlistService.updatePlaylist(username, playlistId, playlistDto);
        return ResponseEntity.ok(updatedPlaylistDto);
    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity<List<PlaylistDto>> deletePlaylist(@RequestParam String username, @PathVariable String playlistId) {
        List<PlaylistDto> playlists = playlistService.deletePlaylist(username, playlistId);
        return ResponseEntity.ok(playlists);
    }

    @PostMapping("/{playlistId}")
    public ResponseEntity<MovieDto> addMovieToPlaylist(@RequestParam String username, @PathVariable String playlistId, @RequestBody MovieDto movieDto) {
        MovieDto addedMovie = playlistService.addMovieToPlaylist(username, playlistId, movieDto);
        return ResponseEntity.ok(addedMovie);
    }

    @DeleteMapping("/{playlistId}/{tmdbIdMovie}")
    public ResponseEntity<List<MovieDto> >deleteMovieFromPlaylist(@RequestParam String username, @PathVariable String playlistId, @PathVariable Long tmdbIdMovie) {
        List<MovieDto> playlistMovies = playlistService.deleteMovieFromPlaylist(username, playlistId, tmdbIdMovie);
        return ResponseEntity.ok(playlistMovies);
    }

}
