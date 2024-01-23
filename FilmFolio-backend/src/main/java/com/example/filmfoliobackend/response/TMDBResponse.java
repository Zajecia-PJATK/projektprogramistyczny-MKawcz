package com.example.filmfoliobackend.response;

import com.example.filmfoliobackend.dto.MovieDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class TMDBResponse {
    private int page;
    private List<MovieDto> results;
    @JsonProperty("total_results")
    private int totalResults;
    @JsonProperty("total_pages")
    private int totalPages;
}
