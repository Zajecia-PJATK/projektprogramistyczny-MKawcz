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
    public ResponseEntity<UserDto> getUserInfo(@RequestParam String username) {
        UserDto userInfo = userService.getUserInfo(username);
        return ResponseEntity.ok(userInfo);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateUserInfo(@RequestParam String username, @RequestBody UserDto updatedUserDto) {
        UserDto updatedUserInfo = userService.updateUserInfo(username, updatedUserDto);
        return ResponseEntity.ok(updatedUserInfo);
    }
}
