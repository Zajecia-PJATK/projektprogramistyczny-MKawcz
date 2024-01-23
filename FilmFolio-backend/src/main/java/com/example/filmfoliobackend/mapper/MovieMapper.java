package com.example.filmfoliobackend.mapper;

import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.model.Genre;
import com.example.filmfoliobackend.model.Movie;
import com.example.filmfoliobackend.service.GenreService;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class MovieMapper {
    private final GenreService genreService;

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
        if(!movie.getGenres().isEmpty() && movie.getGenres() != null) {
            dto.setGenres(movie.getGenres().stream().map(GenreMapper::toDto).toList());
        }

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
