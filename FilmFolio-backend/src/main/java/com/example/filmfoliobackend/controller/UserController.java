package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.dto.UserDto;
import com.example.filmfoliobackend.model.Genre;
import com.example.filmfoliobackend.response.AuthenticationResponse;
import com.example.filmfoliobackend.response.request.AuthenticationRequest;
import com.example.filmfoliobackend.response.request.RegisterRequest;
import com.example.filmfoliobackend.service.AuthenticationService;
import com.example.filmfoliobackend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody @Valid RegisterRequest request) {
        AuthenticationResponse authenticationResponse = authenticationService.register(request);
        return ResponseEntity.ok(authenticationResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody @Valid AuthenticationRequest request) {
        AuthenticationResponse authenticationResponse = authenticationService.authenticate(request);
        return ResponseEntity.ok(authenticationResponse);
    }

    @GetMapping("/{idUser}/stats")
    public ResponseEntity<UserDto> getUserStats(@PathVariable String idUser) {
        UserDto userInfo = userService.getUserStats(idUser);
        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserInfo(@RequestParam String idUser) {
        UserDto userInfo = userService.getUserInfo(idUser);
        return ResponseEntity.ok(userInfo);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateUserInfo(@RequestParam String idUser, @RequestBody @Valid UserDto updatedUserDto) {
        UserDto updatedUserInfo = userService.updateUserInfo(idUser, updatedUserDto);
        return ResponseEntity.ok(updatedUserInfo);
    }

    @PutMapping("/profile/preferences")
    public ResponseEntity<List<GenreDto>> setUserPreferences(@RequestParam String idUser, @RequestBody List<GenreDto> preferences) {
        List<GenreDto> userPreferences = userService.setUserPreferences(idUser, preferences);
        return ResponseEntity.ok(userPreferences);
    }

    @GetMapping("/profile/preferences")
    public ResponseEntity<List<GenreDto>> getUserPreferences(@RequestParam String idUser) {
        List<GenreDto> userPreferences = userService.getUserPreferences(idUser);
        return ResponseEntity.ok(userPreferences);
    }
}
