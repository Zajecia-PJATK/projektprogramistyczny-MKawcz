package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.dto.UserDto;
import com.example.filmfoliobackend.model.enums.Role;
import com.example.filmfoliobackend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> allUsers = adminService.getAllUsers();
        return ResponseEntity.ok(allUsers);
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserDto> changeUserPrivileges(@PathVariable String userId, @RequestParam Role newRole) {
        UserDto userDto = adminService.changeUserPrivileges(userId, newRole);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/movies")
    public ResponseEntity<MovieDto> createMovie(@RequestBody MovieDto movieDto) {
        MovieDto newMovie = adminService.createMovie(movieDto);
        return ResponseEntity.ok(newMovie);
    }

    @PutMapping("/movies/{movieId}")
    public ResponseEntity<MovieDto> updateMovieInfo(@PathVariable String movieId, @RequestBody MovieDto movieDto) {
        MovieDto updatedMovie = adminService.updateMovieInfo(movieId, movieDto);
        return ResponseEntity.ok(updatedMovie);
    }

    @DeleteMapping("/movies/{movieId}")
    public ResponseEntity<String> deleteMovie(@PathVariable String movieId) {
        adminService.deleteMovie(movieId);
        return ResponseEntity.ok("Movie of id: " + movieId + " has been deleted");
    }
}
