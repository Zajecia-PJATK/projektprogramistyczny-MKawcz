package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.dto.UserDto;
import com.example.filmfoliobackend.exception.DuplicateResourceException;
import com.example.filmfoliobackend.exception.UserNotFoundException;
import com.example.filmfoliobackend.jwt.JwtTokenProvider;
import com.example.filmfoliobackend.mapper.GenreMapper;
import com.example.filmfoliobackend.mapper.UserMapper;
import com.example.filmfoliobackend.model.Genre;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final GenreService genreService;

    public UserDto getUserInfo(String idUser, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        UserDto userDto = new UserDto();
        userDto.setUsername(user.getActualUsername());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRoles().stream().findFirst().orElse(null));
        userDto.setWatchedMoviesCount(user.getWatchedMoviesCount());
        userDto.setTotalWatchTime(user.getTotalWatchTime());
        userDto.setMonthlyWatchStats(user.getMonthlyWatchStats());

        return userDto;
    }

    public UserDto updateUserInfo(String idUser, UserDto updatedUserDto, Authentication authentication) {            //TODO po stronie Fronta trzeba będzie dać domyślne wartości (te które są zapisane obecnie) aby nie ustawiać pól na null dla pól dla, których nie podano wartości
        User existingUser = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(existingUser.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

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

    public UserDto getUserStats(String idUser, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        UserDto userDto = new UserDto();
        userDto.setMonthlyWatchStats(user.getMonthlyWatchStats());
        userDto.setTotalWatchTime(user.getTotalWatchTime());
        userDto.setWatchedMoviesCount(user.getWatchedMoviesCount());

        return userDto;
    }

    public List<GenreDto> setUserPreferences(String idUser, List<GenreDto> preferences, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        List<Genre> genresIfExists = genreService.getGenresIfExists(preferences);
        user.setPreferences(genresIfExists);

        userRepository.save(user);

        return user.getPreferences().stream().map(GenreMapper::toDto).toList();
    }

    public List<GenreDto> getUserPreferences(String idUser, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        return user.getPreferences().stream().map(GenreMapper::toDto).toList();
    }

}
