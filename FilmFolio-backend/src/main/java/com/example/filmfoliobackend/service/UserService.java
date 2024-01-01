package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.UserDto;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    public UserDto getUserInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No user found with username: " + username));;

        UserDto userDto = new UserDto();
        userDto.setUsername(user.getActualUsername());
        userDto.setEmail(user.getEmail());

        return userDto;
    }

    public UserDto updateUserInfo(String username, UserDto updatedUserDto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No user found with username: " + username));

        if(userRepository.existsByUsername(updatedUserDto.getUsername())) {
            throw new RuntimeException("User with the given username already exists");
        }

        if(userRepository.existsByEmail(updatedUserDto.getEmail())) {
            throw new RuntimeException("User with the given email already exists");
        }

        user.setUsername(updatedUserDto.getUsername());
        user.setEmail(updatedUserDto.getEmail());

        User updatedUser = userRepository.save(user);

        return getUserInfo(updatedUser.getActualUsername());
    }


}
