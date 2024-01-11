package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.UserDto;
import com.example.filmfoliobackend.exception.DuplicateResourceException;
import com.example.filmfoliobackend.exception.InvalidRequestException;
import com.example.filmfoliobackend.exception.UserNotFoundException;
import com.example.filmfoliobackend.jwt.JwtTokenProvider;
import com.example.filmfoliobackend.mapper.UserMapper;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public UserDto getUserInfo(String idUser) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        UserDto userDto = new UserDto();
        userDto.setUsername(user.getActualUsername());
        userDto.setEmail(user.getEmail());

        return userDto;
    }

    public UserDto updateUserInfo(String idUser, UserDto updatedUserDto) {            //TODO po stronie Fronta trzeba będzie dać domyślne wartości (te które są zapisane obecnie) aby nie ustawiać pól na null dla pól dla, których nie podano wartości
        User existingUser = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        if (!existingUser.getEmail().equals(updatedUserDto.getEmail()) && userRepository.existsByEmail(updatedUserDto.getEmail())) {
            throw new DuplicateResourceException("Email is already taken");
        }

        if (!existingUser.getActualUsername().equals(updatedUserDto.getUsername()) && userRepository.existsByUsername(updatedUserDto.getUsername())) {
            throw new DuplicateResourceException("Username is already taken");
        }

        existingUser.setUsername(updatedUserDto.getUsername());
        existingUser.setEmail(updatedUserDto.getEmail());

        User updatedUser = userRepository.save(existingUser);

        String newToken = jwtTokenProvider.generateToken(updatedUser);
        
        UserDto responseDto = UserMapper.toDto(updatedUser);
        responseDto.setToken(newToken);

        return responseDto;
    }


}
