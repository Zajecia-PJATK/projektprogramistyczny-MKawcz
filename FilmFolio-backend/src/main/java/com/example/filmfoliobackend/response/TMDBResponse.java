package com.example.filmfoliobackend.response;

import com.example.filmfoliobackend.dto.MovieDto;
import lombok.Data;

import java.util.List;

@Data
public class TMDBResponse {
    private int page;
    private List<MovieDto> results;
    private int totalResults;
    private int totalPages;
}
