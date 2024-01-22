package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.UserDto;
import com.example.filmfoliobackend.response.AuthenticationResponse;
import com.example.filmfoliobackend.response.request.AuthenticationRequest;
import com.example.filmfoliobackend.service.AuthenticationService;
import com.example.filmfoliobackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody UserDto userDto) {
        AuthenticationResponse authenticationResponse = authenticationService.register(userDto);
        return ResponseEntity.ok(authenticationResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        AuthenticationResponse authenticationResponse = authenticationService.authenticate(request);
        return ResponseEntity.ok(authenticationResponse);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserInfo(@RequestParam String idUser) {
        UserDto userInfo = userService.getUserInfo(idUser);
        return ResponseEntity.ok(userInfo);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateUserInfo(@RequestParam String idUser, @RequestBody UserDto updatedUserDto) {
        UserDto updatedUserInfo = userService.updateUserInfo(idUser, updatedUserDto);
        return ResponseEntity.ok(updatedUserInfo);
    }
}
