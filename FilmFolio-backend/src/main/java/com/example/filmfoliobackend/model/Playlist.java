package com.example.filmfoliobackend.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document
@Data
@EqualsAndHashCode(of = "idPlaylist")
public class Playlist {
    @Id
    private String idPlaylist;
    private String name;
    private String description;
    @DBRef
    private User user;
    @DBRef
    private List<Movie> movies = new ArrayList<>();
}
