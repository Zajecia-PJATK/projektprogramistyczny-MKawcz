package com.example.filmfoliobackend.mapper;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.model.Movie;

public class MovieMapper {
    public static MovieDto toDto(Movie movie) {
        MovieDto dto = new MovieDto();
        dto.setTmdbIdMovie(movie.getTmdbIdMovie());
        dto.setTitle(movie.getTitle());
        dto.setPosterPath(movie.getPosterPath());
        dto.setReleaseDate(movie.getReleaseDate());

        return dto;
    }

    public static Movie toDocument(MovieDto dto) {
        Movie movie = new Movie();
        movie.setTmdbIdMovie(dto.getTmdbIdMovie());
        movie.setTitle(dto.getTitle());
        movie.setPosterPath(dto.getPosterPath());
        movie.setReleaseDate(dto.getReleaseDate());

        return movie;
    }
}
