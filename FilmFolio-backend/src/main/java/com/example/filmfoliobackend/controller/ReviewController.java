package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.ReviewDto;
import com.example.filmfoliobackend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/{movieId}/reviews")
    public ResponseEntity<List<ReviewDto>> createReview(@RequestParam String idUser, @PathVariable Long movieId, @RequestBody @Valid ReviewDto reviewDto) {
        List<ReviewDto> reviews = reviewService.createReview(idUser, movieId, reviewDto);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{movieId}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviews(@PathVariable Long movieId) {
        List<ReviewDto> reviews = reviewService.getReviews(movieId);
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{movieId}/reviews/{reviewId}")
    public ResponseEntity<List<ReviewDto>> deleteReview(@RequestParam String idUser, @PathVariable Long movieId, @PathVariable String reviewId) {
        List<ReviewDto> reviews = reviewService.deleteReview(idUser, movieId, reviewId);
        return ResponseEntity.ok(reviews);
    }

}
