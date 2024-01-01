package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.ReviewDto;
import com.example.filmfoliobackend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/{movieId}/reviews")
    public ResponseEntity<List<ReviewDto>> createReview(@RequestParam String username, @PathVariable Long movieId, @RequestBody ReviewDto reviewDto) {
        List<ReviewDto> reviews = reviewService.createReview(username, movieId, reviewDto);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{movieId}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviews(@PathVariable Long movieId) {
        List<ReviewDto> reviews = reviewService.getReviews(movieId);
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{movieId}/reviews/{reviewId}")
    public ResponseEntity<List<ReviewDto>> deleteReview(@RequestParam String username, @PathVariable Long movieId, @PathVariable String reviewId) {
        List<ReviewDto> reviews = reviewService.deleteReview(username, movieId, reviewId);
        return ResponseEntity.ok(reviews);
    }

}
