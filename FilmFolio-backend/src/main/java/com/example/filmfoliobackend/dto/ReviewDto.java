package com.example.filmfoliobackend.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ReviewDto {
    private String content;
    private Integer rating;
    private Date createdDate;
}
