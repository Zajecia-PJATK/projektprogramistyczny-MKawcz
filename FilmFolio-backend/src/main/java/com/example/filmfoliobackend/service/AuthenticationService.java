package com.example.filmfoliobackend.service;


import com.example.filmfoliobackend.dto.UserDto;
import com.example.filmfoliobackend.exception.DuplicateResourceException;
import com.example.filmfoliobackend.exception.InvalidRequestException;
import com.example.filmfoliobackend.exception.UserNotFoundException;
import com.example.filmfoliobackend.jwt.JwtTokenProvider;
import com.example.filmfoliobackend.mapper.UserMapper;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.model.enums.Role;
import com.example.filmfoliobackend.repository.UserRepository;
import com.example.filmfoliobackend.response.AuthenticationResponse;
import com.example.filmfoliobackend.response.request.AuthenticationRequest;
import com.example.filmfoliobackend.response.request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public String register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already taken");
        }

        if(request.getRole() == null || (!Objects.equals(request.getRole().toString(), "ROLE_ADMIN") && !Objects.equals(request.getRole().toString(), "ROLE_USER"))) {
            throw new InvalidRequestException("Role has to be either ROLE_ADMIN or ROLE_USER");
        }

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(request.getRole()))
                .build();
        userRepository.save(user);
//        var jwtToken = jwtTokenProvider.generateToken(user);
//        return AuthenticationResponse.builder()
//                .token(jwtToken)
//                .build();
        return user.getActualUsername();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("No user with the given email " + request.getEmail()));
        var jwtToken = jwtTokenProvider.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
