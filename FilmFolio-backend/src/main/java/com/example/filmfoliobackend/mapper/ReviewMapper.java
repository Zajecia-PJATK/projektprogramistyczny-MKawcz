package com.example.filmfoliobackend.mapper;

import com.example.filmfoliobackend.dto.ReviewDto;
import com.example.filmfoliobackend.model.Review;

public class ReviewMapper {
    public static ReviewDto toDto(Review review) {
        ReviewDto reviewDto = new ReviewDto();
        reviewDto.setIdReview(review.getIdReview());
        reviewDto.setContent(review.getContent());
        reviewDto.setRating(review.getRating());
        reviewDto.setCreatedDate(review.getCreatedDate());

        return reviewDto;
    }

    public static Review toDocument(ReviewDto reviewDto) {
        Review review = new Review();
        review.setContent(reviewDto.getContent());
        review.setRating(reviewDto.getRating());
        review.setCreatedDate(reviewDto.getCreatedDate());

        return review;
    }

}
