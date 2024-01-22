package com.example.filmfoliobackend.mapper;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.model.Movie;

public class MovieMapper {
    public static MovieDto toDto(Movie movie) {
        MovieDto dto = new MovieDto();
        dto.setIdMovie(movie.getIdMovie());
        dto.setTmdbIdMovie(movie.getTmdbIdMovie());
        dto.setTitle(movie.getTitle());
        dto.setOverview(movie.getOverview());
        dto.setPosterPath(movie.getPosterPath());
        dto.setBackdropPath(movie.getBackdropPath());
        dto.setVoteAverage(movie.getVoteAverage());
        dto.setVoteCount(movie.getVoteCount());
        dto.setReleaseDate(movie.getReleaseDate());
        dto.setRuntime(movie.getRuntime());
        dto.setAdult(movie.getAdult());

        return dto;
    }

    public static Movie toDocument(MovieDto dto) {
        Movie movie = new Movie();
        movie.setTmdbIdMovie(dto.getTmdbIdMovie());
        movie.setTitle(dto.getTitle());
        movie.setOverview(dto.getOverview());
        movie.setPosterPath(dto.getPosterPath());
        movie.setBackdropPath(dto.getBackdropPath());
        movie.setVoteAverage(dto.getVoteAverage());
        movie.setVoteCount(dto.getVoteCount());
        movie.setReleaseDate(dto.getReleaseDate());
        movie.setRuntime(dto.getRuntime());
        movie.setAdult(dto.getAdult());

        return movie;
    }
}
