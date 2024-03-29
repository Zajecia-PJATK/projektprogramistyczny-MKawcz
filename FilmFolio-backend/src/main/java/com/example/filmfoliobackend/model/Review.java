package com.example.filmfoliobackend.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document
@Data
@EqualsAndHashCode(of = "idReview")
public class Review {
    @Id
    private String idReview;
    @DBRef
    private User user;
    @DBRef
    private Movie movie;
    private String content;
    private Integer rating;
    @CreatedDate
    private Date createdDate;
}
