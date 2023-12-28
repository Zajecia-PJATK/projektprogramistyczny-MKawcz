package com.example.filmfoliobackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Data
public class Playlist {
    @Id
    private Long idPlaylist;
    private String name;
    private String description;
    @DBRef
    private User user;
    @DBRef
    private List<Movie> movies;
}
