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
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> allUsers = adminService.getAllUsers();
        return ResponseEntity.ok(allUsers);
    }

    @PutMapping("/users/{idUser}")
    public ResponseEntity<UserDto> changeUserPrivileges(@PathVariable String idUser, @RequestParam Role newRole) {
        UserDto userDto = adminService.changeUserPrivileges(idUser, newRole);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/movies")
    public ResponseEntity<MovieDto> createMovie(@RequestBody MovieDto movieDto) {
        MovieDto newMovie = adminService.createMovie(movieDto);
        return ResponseEntity.ok(newMovie);
    }

    @PutMapping("/movies/{idMovie}")
    public ResponseEntity<MovieDto> updateMovieInfo(@PathVariable String idMovie, @RequestBody MovieDto movieDto) {
        MovieDto updatedMovie = adminService.updateMovieInfo(idMovie, movieDto);
        return ResponseEntity.ok(updatedMovie);
    }

    @DeleteMapping("/movies/{idMovie}")
    public ResponseEntity<String> deleteMovie(@PathVariable String idMovie) {
        adminService.deleteMovie(idMovie);
        return ResponseEntity.ok("Movie of id: " + idMovie + " has been deleted");
    }
}
