package com.example.filmfoliobackend.dto;

import com.example.filmfoliobackend.model.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.YearMonth;
import java.util.Map;

@Data
public class UserDto {
    private String idUser;
    @NotBlank(message = "Field username cannot be blank")
    @Size(max=50, message = "Field username should be max 50 characters long")
    private String username;
    @Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Provided email has an invalid format")
    private String email;
    private String password;
    private Role role;
    private String token;
    private Integer watchedMoviesCount;
    private Integer totalWatchTime;
    private Map<String, Integer> monthlyWatchStats;
}
