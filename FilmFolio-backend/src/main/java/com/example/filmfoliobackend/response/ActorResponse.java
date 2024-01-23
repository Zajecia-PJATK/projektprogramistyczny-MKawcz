package com.example.filmfoliobackend.response;

import com.example.filmfoliobackend.dto.ActorDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class ActorResponse {
    @JsonProperty("id")
    private Long tmdbIdMovie;
    private List<ActorDto> cast;
}
