package com.example.filmfoliobackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ActorDto {
    @JsonProperty("id")
    private Long tmdbIdActor;
    private String name;
    private String character;
    @JsonProperty("profile_path")
    private String profilePath;
}
