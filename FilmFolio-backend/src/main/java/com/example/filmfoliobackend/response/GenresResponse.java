package com.example.filmfoliobackend.response;

import com.example.filmfoliobackend.dto.GenreDto;
import lombok.Data;

import java.util.List;

@Data
public class GenresResponse {
    private List<GenreDto> genres;
}
