package com.example.filmfoliobackend.controller;

import com.example.filmfoliobackend.dto.ActorDto;
import com.example.filmfoliobackend.service.ActorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies/cast")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ActorController {
    private final ActorService actorService;

    @GetMapping
    public ResponseEntity<List<ActorDto>> getMovieCast(@RequestParam Long idMovie) {
        List<ActorDto> movieCast = actorService.getMovieCast(idMovie);
        return ResponseEntity.ok(movieCast);
    }
}
