package com.example.filmfoliobackend.dto;

import lombok.Data;

@Data
public class MovieDto {
    private Long id;
    private String title;
    private String overview;
    private String posterPath;
    private String backdropPath;
    private Double voteAverage;
    private Integer voteCount;
    private String releaseDate;
    private Integer runtime;
    private Boolean adult;
//    private List<Integer> genre_ids;
}
