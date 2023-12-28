package com.example.filmfoliobackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Data
public class User {
    @Id
    private Long idUser;
    private String username;
    private String email;
    private String password;
    @DBRef
    private List<Movie> watchlist;
    @DBRef
    private List<Playlist> playlists;
    @DBRef
    private List<Review> reviews;
}
