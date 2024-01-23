package com.example.filmfoliobackend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Date;

@Data
public class ReviewDto {
    private String idReview;
    @NotBlank(message = "Review content cannot be blank")
    @Size(max=3000, message = "Review content should be max 3000 characters long")
    private String content;
    @Min(value = 1, message = "Rating cannot be less than 1")
    private Integer rating;
    private Date createdDate;
}
