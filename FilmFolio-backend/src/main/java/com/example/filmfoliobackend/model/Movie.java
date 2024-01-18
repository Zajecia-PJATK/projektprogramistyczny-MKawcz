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
@EqualsAndHashCode(of = "idMovie")
public class Movie {
    @Id
    private String idMovie;
    private Long tmdbIdMovie;
    private String title;
    private String overview;
    private String posterPath;
    private String backdropPath;
    private Double voteAverage;     //TODO pobierać z api a nie zapisywać w bazie
    private Integer voteCount;
//    private Double appVoteAverage; // Średnia ocen z filmFolio
//    private Integer appVoteCount; // Liczba ocen z filmFolio
    private String releaseDate;
    private Integer runtime;
    private Boolean adult;
    private Boolean isCustom;
    @DBRef
    private List<Genre> genres = new ArrayList<>();
    @DBRef
    private List<Playlist> playlists = new ArrayList<>();
    @DBRef
    private List<User> users = new ArrayList<>();
    @DBRef
    private List<Review> reviews = new ArrayList<>();
}
