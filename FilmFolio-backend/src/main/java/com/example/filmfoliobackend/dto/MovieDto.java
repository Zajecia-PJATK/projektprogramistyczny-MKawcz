package com.example.filmfoliobackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class MovieDto {
    private String idMovie;
    @JsonProperty("id")
    private Long tmdbIdMovie;
    @NotBlank(message = "Movie title cannot be blank")
    @Size(max=50, message = "Movie title should be max 50 characters long")
    private String title;
    @NotBlank(message = "Movie overview cannot be blank")
    @Size(max=2000, message = "Movie overview should be max 2000 characters long")
    private String overview;
    @Pattern(regexp = "^/\\w+(/[\\w-]+)+\\.\\w{3,4}$", message = "Provided image path has an invalid format")
    @JsonProperty("poster_path")
    private String posterPath;
    @Pattern(regexp = "^/\\w+(/[\\w-]+)+\\.\\w{3,4}$", message = "Provided image path has an invalid format")
    @JsonProperty("backdrop_path")
    private String backdropPath;
    @JsonProperty("vote_average")
    private Double voteAverage;
    @JsonProperty("vote_count")
    private Integer voteCount;
    @JsonProperty("release_date")
    private String releaseDate;
    @Min(value = 0, message = "Runtime cannot be less than 0")
    private Integer runtime;        //endpoint popular nie zwraca runtime
    private Boolean adult;
    private List<GenreDto> genres;
}
//TODO dodaj aktorów jako oddzielną metodę w serwisie