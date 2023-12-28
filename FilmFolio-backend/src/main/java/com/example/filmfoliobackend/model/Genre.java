package com.example.filmfoliobackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Data
public class Genre {
    @Id
    private Long idGenre;
    private Long tmdbIdGenre;
    private String name;
    @DBRef
    private List<Movie> movies;
}
