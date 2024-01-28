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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
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
    public ResponseEntity<String> register(@RequestBody @Valid RegisterRequest request) {
        String username = authenticationService.register(request);
        return ResponseEntity.ok("Successfully registered user " + username);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody @Valid AuthenticationRequest request) {
        AuthenticationResponse authenticationResponse = authenticationService.authenticate(request);
        return ResponseEntity.ok(authenticationResponse);
    }

    @GetMapping("/{idUser}/stats")
    public ResponseEntity<UserDto> getUserStats(@PathVariable String idUser, Authentication authentication) {
        UserDto userInfo = userService.getUserStats(idUser, authentication);
        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserInfo(@RequestParam String idUser, Authentication authentication) {
        UserDto userInfo = userService.getUserInfo(idUser, authentication);
        return ResponseEntity.ok(userInfo);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateUserInfo(@RequestParam String idUser, @RequestBody @Valid UserDto updatedUserDto, Authentication authentication) {
        UserDto updatedUserInfo = userService.updateUserInfo(idUser, updatedUserDto, authentication);
        return ResponseEntity.ok(updatedUserInfo);
    }

    @PutMapping("/profile/preferences")
    public ResponseEntity<List<GenreDto>> setUserPreferences(@RequestParam String idUser, @RequestBody List<GenreDto> preferences, Authentication authentication) {
        List<GenreDto> userPreferences = userService.setUserPreferences(idUser, preferences, authentication);
        return ResponseEntity.ok(userPreferences);
    }

    @GetMapping("/profile/preferences")
    public ResponseEntity<List<GenreDto>> getUserPreferences(@RequestParam String idUser, Authentication authentication) {
        List<GenreDto> userPreferences = userService.getUserPreferences(idUser, authentication);
        return ResponseEntity.ok(userPreferences);
    }
}
