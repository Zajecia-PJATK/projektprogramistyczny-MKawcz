package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.dto.UserDto;
import com.example.filmfoliobackend.mapper.MovieMapper;
import com.example.filmfoliobackend.mapper.UserMapper;
import com.example.filmfoliobackend.model.Movie;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.model.enums.Role;
import com.example.filmfoliobackend.repository.MovieRepository;
import com.example.filmfoliobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    public List<UserDto> getAllUsers() {
        List<User> allUsers = userRepository.findAll();
        List<UserDto> allUsersDto = allUsers.stream().map(UserMapper::toDto).toList();

        return allUsersDto;
    }

    public UserDto changeUserPrivileges(String userId, Role newRole) {
        User user = userRepository.findByIdUser(userId)
                .orElseThrow(() -> new RuntimeException("No user found with id: " + userId));

        user.setRoles(Collections.singleton(newRole));
        userRepository.save(user);

        return UserMapper.toDto(user);
    }

    public MovieDto createMovie(MovieDto movieDto) {
        Movie movie = new Movie();
        movie.setTitle(movieDto.getTitle());
        movie.setPosterPath(movieDto.getPosterPath());
        movie.setReleaseDate(movieDto.getReleaseDate());
        //TODO reszta pól

        movieRepository.save(movie);

        return MovieMapper.toDto(movie);        //TODO sprawdź czy będzie działało bez podania tmdb id
    }

    public MovieDto updateMovieInfo(String movieId, MovieDto movieDto) {
        Movie movie = movieRepository.findByIdMovie(movieId)
                .orElseThrow(() -> new RuntimeException("Movie with the given id:" + movieId + " not found"));

        movie.setTitle(movieDto.getTitle());
        movie.setPosterPath(movieDto.getPosterPath());
        movie.setReleaseDate(movieDto.getPosterPath());
        //TODO reszta pól

        movieRepository.save(movie);

        return MovieMapper.toDto(movie);        //TODO sprawdź czy będzie działało bez podania tmdb id
    }

    public void deleteMovie(String movieId) {
        Movie movie = movieRepository.findByIdMovie(movieId)
                .orElseThrow(() -> new RuntimeException("Movie with the given id:" + movieId + " not found"));

        movieRepository.delete(movie);
    }
}
