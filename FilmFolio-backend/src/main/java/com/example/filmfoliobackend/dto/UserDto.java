package com.example.filmfoliobackend.dto;

import com.example.filmfoliobackend.model.enums.Role;
import lombok.Data;
import org.apache.el.parser.Token;

@Data
public class UserDto {
    private String username;
    private String email;
    private String password;
    private Role role;
    private String token;
}
