package com.example.filmfoliobackend.service;

import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.dto.ReviewDto;
import com.example.filmfoliobackend.exception.MovieNotFoundException;
import com.example.filmfoliobackend.exception.ResourceOwnershipException;
import com.example.filmfoliobackend.exception.ReviewNotFoundException;
import com.example.filmfoliobackend.exception.UserNotFoundException;
import com.example.filmfoliobackend.mapper.ReviewMapper;
import com.example.filmfoliobackend.model.Movie;
import com.example.filmfoliobackend.model.Review;
import com.example.filmfoliobackend.model.User;
import com.example.filmfoliobackend.repository.MovieRepository;
import com.example.filmfoliobackend.repository.ReviewRepository;
import com.example.filmfoliobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final MovieRepository movieRepository;
    private final WatchlistService watchlistService;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final MovieService movieService;

    public List<ReviewDto> createReview(String username, Long tmdbIdmovie, ReviewDto reviewDto) {
        MovieDto movieDto = movieService.getMovie(tmdbIdmovie);

        watchlistService.addMovieToWatchlist(username, movieDto);

        var movie = movieRepository.findByTmdbIdMovie(tmdbIdmovie);
        var user = userRepository.findByUsername(username);

        Review review = ReviewMapper.toDocument(reviewDto);
        review.setUser(user.get());
        review.setMovie(movie.get());
        Review savedReview = reviewRepository.save(review);

        movie.get().getReviews().add(savedReview);
        user.get().getReviews().add(savedReview);

        movieRepository.save(movie.get());
        userRepository.save(user.get());

        return getReviews(movie.get().getTmdbIdMovie());
    }

    public List<ReviewDto> getReviews(Long tmdbIdmovie) {
        Movie movie = movieRepository.findByTmdbIdMovie(tmdbIdmovie)
                .orElseThrow(() -> new MovieNotFoundException("No movie found in the database with the TMDB id: " + tmdbIdmovie));

        List<ReviewDto> movieReviewsDto = movie.getReviews().stream().map(ReviewMapper::toDto).toList();

        return movieReviewsDto;
    }

    public List<ReviewDto> deleteReview(String username, Long tmdbIdmovie, String reviewId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("No user found with username: " + username));

        Movie movie = movieRepository.findByTmdbIdMovie(tmdbIdmovie)
                .orElseThrow(() -> new MovieNotFoundException("No movie found in the database with the TMDB id: " + tmdbIdmovie));

        Review review = reviewRepository.findByIdReview(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("No review found with id: " + reviewId));

        if(!reviewRepository.existsByIdReviewAndUser(reviewId, user)) {
            throw new ResourceOwnershipException("Review with ID " + reviewId + " does not belong to the user " + username);
        }

//        if(!reviewRepository.existsByIdReviewAndMovieTmdbIdMovie(reviewId, tmdbIdmovie)) {
//            throw new RuntimeException("Review with the id does not belong to the movie with TMDB id");
//        }

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
    }   //TODO sprawdzić aby we wszystkich metodach nie zwracać innej metody serwisu!!!!!!
}
