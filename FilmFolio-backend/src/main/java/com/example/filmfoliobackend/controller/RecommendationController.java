package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.GenreDto;
import com.example.filmfoliobackend.dto.MovieDto;
import com.example.filmfoliobackend.service.GenreService;
import com.example.filmfoliobackend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {
    private final RecommendationService recommendationService;

    @GetMapping
    public CompletableFuture<ResponseEntity<List<MovieDto>>> getRecommendations(@RequestParam String idUser, Authentication authentication) {
        return recommendationService.getRecommendations(idUser, authentication)
                .thenApply(ResponseEntity::ok);
    }

//    Metoda getRecommendations w kontrolerze również zwraca
//    CompletableFuture<ResponseEntity<List<MovieDto>>>. To umożliwia asynchroniczne przetwarzanie
//    żądania HTTP bez blokowania wątku.
//    thenApply(ResponseEntity::ok) przekształca wynik asynchronicznej operacji na odpowiedź HTTP,
//    co jest podobne do łańcuchowania .then w obietnicach.
}
