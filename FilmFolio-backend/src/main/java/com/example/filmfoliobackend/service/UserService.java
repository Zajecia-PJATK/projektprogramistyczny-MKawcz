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
        var optionalUser = userRepository.findByUsername(username);

        if(optionalUser.isEmpty()) {
            throw new RuntimeException("No user with the given username");
        }

        User user = optionalUser.get();

        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());

        return userDto;
    }

    public UserDto updateUserInfo(String username, UserDto updatedUserDto) {
        var optionalUser = userRepository.findByUsername(username);

        if(optionalUser.isEmpty()) {
            throw new RuntimeException("No user with the given username");
        }
        //TODO sprawdz czy mail i nazwa nie są już zajęte !!!!!!

        User user = optionalUser.get();
        user.setUsername(updatedUserDto.getUsername());
        user.setEmail(updatedUserDto.getEmail());

        User updatedUser = userRepository.save(user);

        return getUserInfo(updatedUser.getUsername());
    }


}
