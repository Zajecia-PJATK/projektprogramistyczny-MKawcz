package com.example.filmfoliobackend.dto;

import lombok.Data;

import java.util.List;

@Data
public class PlaylistDto {
    private String idPlaylist;
    private String name;
    private String description;
    private List<MovieDto> movies;
}
