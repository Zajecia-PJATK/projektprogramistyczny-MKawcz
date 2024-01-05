package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.UserDto;
import com.example.filmfoliobackend.exception.DuplicateResourceException;
import com.example.filmfoliobackend.exception.InvalidRequestException;
import com.example.filmfoliobackend.exception.UserNotFoundException;
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
                .orElseThrow(() -> new UserNotFoundException("No user found with username: " + username));

        UserDto userDto = new UserDto();
        userDto.setUsername(user.getActualUsername());
        userDto.setEmail(user.getEmail());

        return userDto;
    }

    public UserDto updateUserInfo(String username, UserDto updatedUserDto) {            //TODO po stronie Fronta trzeba będzie dać domyślne wartości (te które są zapisane obecnie) aby nie ustawiać pól na null dla pól dla, których nie podano wartości
        User existingUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("No user found with username: " + username));

        if (!existingUser.getEmail().equals(updatedUserDto.getEmail()) && userRepository.existsByEmail(updatedUserDto.getEmail())) {
            throw new DuplicateResourceException("Email is already taken");
        }

        if (!existingUser.getUsername().equals(updatedUserDto.getUsername()) && userRepository.existsByUsername(updatedUserDto.getUsername())) {
            throw new DuplicateResourceException("Username is already taken");
        }

        existingUser.setUsername(updatedUserDto.getUsername());
        existingUser.setEmail(updatedUserDto.getEmail());

        User updatedUser = userRepository.save(existingUser);

        return getUserInfo(updatedUser.getActualUsername());
    }


}
