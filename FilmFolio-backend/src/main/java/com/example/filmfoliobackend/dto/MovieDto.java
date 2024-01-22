package com.example.filmfoliobackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MovieDto {
    private String idMovie;
    @JsonProperty("id")
    private Long tmdbIdMovie;
    private String title;
    private String overview;
    @JsonProperty("poster_path")
    private String posterPath;
    @JsonProperty("backdrop_path")
    private String backdropPath;
    @JsonProperty("vote_average")
    private Double voteAverage;
    @JsonProperty("vote_count")
    private Integer voteCount;
    @JsonProperty("release_date")
    private String releaseDate;
    private Integer runtime;        //endpoint popular nie zwraca runtime
    private Boolean adult;
//    private List<Integer> genre_ids;
}
