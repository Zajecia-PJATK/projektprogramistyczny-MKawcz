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
@CrossOrigin(origins = "http://localhost:3000")
public class PlaylistController {
    private final PlaylistService playlistService;

    @GetMapping
    public ResponseEntity<List<PlaylistDto>> getPlaylists(@RequestParam String idUser) {
        List<PlaylistDto> playlists = playlistService.getPlaylists(idUser);
        return ResponseEntity.ok(playlists);
    }

    @PostMapping
    public ResponseEntity<PlaylistDto> createPlaylist(@RequestParam String idUser, @RequestBody PlaylistDto playlistDto) {
        PlaylistDto playlist = playlistService.createPlaylist(idUser, playlistDto);
        return ResponseEntity.ok(playlist);
    }

    @GetMapping("/{playlistId}")
    public ResponseEntity<PlaylistDto> getPlaylist(@RequestParam String idUser, @PathVariable String playlistId) {
        PlaylistDto playlistDto = playlistService.getPlaylist(idUser, playlistId);
        return ResponseEntity.ok(playlistDto);
    }

    @PutMapping("/{playlistId}")
    public ResponseEntity<PlaylistDto> updatePlaylist(@RequestParam String idUser, @PathVariable String playlistId , @RequestBody PlaylistDto playlistDto) {
        PlaylistDto updatedPlaylistDto = playlistService.updatePlaylist(idUser, playlistId, playlistDto);
        return ResponseEntity.ok(updatedPlaylistDto);
    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity<List<PlaylistDto>> deletePlaylist(@RequestParam String idUser, @PathVariable String playlistId) {
        List<PlaylistDto> playlists = playlistService.deletePlaylist(idUser, playlistId);
        return ResponseEntity.ok(playlists);
    }

    @PostMapping("/{playlistId}")
    public ResponseEntity<MovieDto> addMovieToPlaylist(@RequestParam String idUser, @PathVariable String playlistId, @RequestBody MovieDto movieDto) {
        MovieDto addedMovie = playlistService.addMovieToPlaylist(idUser, playlistId, movieDto);
        return ResponseEntity.ok(addedMovie);
    }

    @DeleteMapping("/{playlistId}/{tmdbIdMovie}")
    public ResponseEntity<List<MovieDto>> deleteMovieFromPlaylist(@RequestParam String idUser, @PathVariable String playlistId, @PathVariable Long tmdbIdMovie) {
        List<MovieDto> playlistMovies = playlistService.deleteMovieFromPlaylist(idUser, playlistId, tmdbIdMovie);
        return ResponseEntity.ok(playlistMovies);
    }

}
