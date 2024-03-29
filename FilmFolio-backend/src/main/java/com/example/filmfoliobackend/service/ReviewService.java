package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.dto.ReviewDto;
import com.example.filmfoliobackend.exception.*;
import com.example.filmfoliobackend.mapper.GenreMapper;
import com.example.filmfoliobackend.mapper.MovieMapper;
import com.example.filmfoliobackend.mapper.ReviewMapper;
import com.example.filmfoliobackend.model.Movie;
import com.example.filmfoliobackend.model.Review;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.repository.GenreRepository;
import com.example.filmfoliobackend.repository.MovieRepository;
import com.example.filmfoliobackend.repository.ReviewRepository;
import com.example.filmfoliobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final MovieService movieService;

    public List<ReviewDto> createReview(String idUser, Long tmdbIdmovie, ReviewDto reviewDto, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        MovieDto movieDto = movieService.getMovie(tmdbIdmovie);

        Movie movie = movieService.saveMovieOrReturnExisting(movieDto);


        boolean reviewExists = reviewRepository.findByUserAndMovie(user, movie).isPresent();
        if (reviewExists) {
            throw new ResourceOwnershipException(user.getActualUsername() + " has already reviewed movie " + movie.getTitle());
        }

        Review review = ReviewMapper.toDocument(reviewDto);
        review.setUser(user);
        review.setMovie(movie);
        Review savedReview = reviewRepository.save(review);

        movie.getReviews().add(savedReview);
        user.getReviews().add(savedReview);

        movieRepository.save(movie);
        userRepository.save(user);

        return getReviews(movie.getTmdbIdMovie());
    }

    public List<ReviewDto> getReviews(Long tmdbIdmovie) {
        MovieDto movieDto = movieService.getMovie(tmdbIdmovie);

        Movie movie = movieService.saveMovieOrReturnExisting(movieDto);

        List<ReviewDto> movieReviewsDto = movie.getReviews().stream().map(ReviewMapper::toDto).toList();

        return movieReviewsDto;
    }

    public List<ReviewDto> deleteReview(String idUser, Long tmdbIdmovie, String reviewId, Authentication authentication) {
        User user = userRepository.findByIdUser(idUser)
                .orElseThrow(() -> new UserNotFoundException("No user found with id: " + idUser));

        String loggedInUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        if (!loggedInUsername.equals(user.getUsername())) {
            throw new AccessDeniedException("Access denied");
        }

        Movie movie = movieRepository.findByTmdbIdMovie(tmdbIdmovie)
                .orElseThrow(() -> new MovieNotFoundException("No movie found in the database with the TMDB id: " + tmdbIdmovie));

        Review review = reviewRepository.findByIdReview(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("No review found with id: " + reviewId));

        if(!reviewRepository.existsByIdReviewAndUser(reviewId, user)) {
            throw new ResourceOwnershipException("Review with ID " + reviewId + " does not belong to the user " + user.getActualUsername());
        }

        boolean isReviewPresentInMovie = movie.getReviews().stream()
                .anyMatch(r -> r.getIdReview().equals(reviewId));

        if(!isReviewPresentInMovie) {
            throw new ResourceOwnershipException("Review with ID " + reviewId + " does not belong to the movie with TMDB ID " + tmdbIdmovie);
        }

        movie.getReviews().remove(review);
        user.getReviews().remove(review);

        movieRepository.save(movie);
        userRepository.save(user);
        reviewRepository.delete(review);

        return movie.getReviews().stream().map(ReviewMapper::toDto).toList();
    }
}
