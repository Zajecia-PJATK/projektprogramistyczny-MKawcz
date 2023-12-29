package com.example.filmfoliobackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Data
public class Movie {
    @Id
    private String idMovie;
    private Long tmdbIdMovie;
    private String title;
//    private String overview;
    private String posterPath;
//    private String backdropPath;
//    private Double voteAverage;     //możliwe że trzeba będzie pobierać z api a nie zapisywać w bazie
//    private Integer voteCount;
//    private Double appVoteAverage; // Średnia ocen z filmFolio
//    private Integer appVoteCount; // Liczba ocen z filmFolio
    private String releaseDate;
//    private Integer runtime;
//    private Boolean adult;
    @DBRef
    private List<Genre> genres;
    @DBRef
    private List<Playlist> playlists;
    @DBRef
    private List<User> users;
    @DBRef
    private List<Review> reviews;
}
