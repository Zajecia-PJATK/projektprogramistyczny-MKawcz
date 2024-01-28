package com.example.filmfoliobackend.controller;


import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.dto.PlaylistDto;
import com.example.filmfoliobackend.service.PlaylistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PlaylistController {
    private final PlaylistService playlistService;

    @GetMapping
    public ResponseEntity<List<PlaylistDto>> getPlaylists(@RequestParam String idUser, Authentication authentication) {
        List<PlaylistDto> playlists = playlistService.getPlaylists(idUser, authentication);
        return ResponseEntity.ok(playlists);
    }

    @PostMapping
    public ResponseEntity<PlaylistDto> createPlaylist(@RequestParam String idUser, @RequestBody @Valid PlaylistDto playlistDto, Authentication authentication) {
        PlaylistDto playlist = playlistService.createPlaylist(idUser, playlistDto, authentication);
        return ResponseEntity.ok(playlist);
    }

    @GetMapping("/{playlistId}")
    public ResponseEntity<PlaylistDto> getPlaylist(@RequestParam String idUser, @PathVariable String playlistId, Authentication authentication) {
        PlaylistDto playlistDto = playlistService.getPlaylist(idUser, playlistId, authentication);
        return ResponseEntity.ok(playlistDto);
    }

    @PutMapping("/{playlistId}")
    public ResponseEntity<PlaylistDto> updatePlaylist(@RequestParam String idUser, @PathVariable String playlistId , @RequestBody @Valid PlaylistDto playlistDto, Authentication authentication) {
        PlaylistDto updatedPlaylistDto = playlistService.updatePlaylist(idUser, playlistId, playlistDto, authentication);
        return ResponseEntity.ok(updatedPlaylistDto);
    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity<List<PlaylistDto>> deletePlaylist(@RequestParam String idUser, @PathVariable String playlistId, Authentication authentication) {
        List<PlaylistDto> playlists = playlistService.deletePlaylist(idUser, playlistId, authentication);
        return ResponseEntity.ok(playlists);
    }

    @PostMapping("/{playlistId}")
    public ResponseEntity<MovieDto> addMovieToPlaylist(@RequestParam String idUser, @PathVariable String playlistId, @RequestBody @Valid MovieDto movieDto, Authentication authentication) {
        MovieDto addedMovie = playlistService.addMovieToPlaylist(idUser, playlistId, movieDto, authentication);
        return ResponseEntity.ok(addedMovie);
    }

    @DeleteMapping("/{playlistId}/{tmdbIdMovie}")
    public ResponseEntity<List<MovieDto>> deleteMovieFromPlaylist(@RequestParam String idUser, @PathVariable String playlistId, @PathVariable Long tmdbIdMovie, Authentication authentication) {
        List<MovieDto> playlistMovies = playlistService.deleteMovieFromPlaylist(idUser, playlistId, tmdbIdMovie, authentication);
        return ResponseEntity.ok(playlistMovies);
    }

}
