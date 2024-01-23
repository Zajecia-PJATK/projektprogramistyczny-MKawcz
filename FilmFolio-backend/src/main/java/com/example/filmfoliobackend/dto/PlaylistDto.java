package com.example.filmfoliobackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class PlaylistDto {
    private String idPlaylist;
    @NotBlank(message = "Playlist name cannot be blank")
    @Size(max=50, message = "Playlist name should be max 50 characters long")
    private String name;
    @NotBlank(message = "Playlist description cannot be blank")
    @Size(max=1000, message = "Playlist description should be max 1000 characters long")
    private String description;
    private List<MovieDto> movies;
}
