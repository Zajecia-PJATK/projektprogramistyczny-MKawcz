package com.example.filmfoliobackend.mapper;

import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.model.Genre;

public class GenreMapper {
    public static GenreDto toDto(Genre genre) {
        GenreDto dto = new GenreDto();
        dto.setTmdbIdGenre(genre.getTmdbIdGenre());
        dto.setName(genre.getName());

        return dto;
    }

    public static Genre toDocument(GenreDto dto) {
        Genre genre = new Genre();
        genre.setTmdbIdGenre(dto.getTmdbIdGenre());
        genre.setName(dto.getName());

        return genre;
    }
}
