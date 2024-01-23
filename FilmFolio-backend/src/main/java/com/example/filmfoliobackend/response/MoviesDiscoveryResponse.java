package com.example.filmfoliobackend.response;

import com.example.filmfoliobackend.dto.MovieDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MoviesDiscoveryResponse {
    private List<MovieDto> movies;
    private int totalPages;
}
