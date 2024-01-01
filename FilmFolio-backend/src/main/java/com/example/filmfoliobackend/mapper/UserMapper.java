package com.example.filmfoliobackend.mapper;

import com.example.filmfoliobackend.dto.UserDto;
import com.example.filmfoliobackend.model.User;

public class UserMapper {
    public static UserDto toDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRoles().iterator().next());
        return userDto;
    }

    public static User toDocument(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());

        return user;
    }
}
