package com.example.filmfoliobackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GenreDto {
    @JsonProperty("id")
    private Long tmdbIdGenre;
    private String name;
}
