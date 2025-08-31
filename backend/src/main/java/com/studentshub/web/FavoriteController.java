package com.studentshub.web;

import com.studentshub.dto.create.CreateFavoriteDto;
import com.studentshub.dto.display.DisplayFavoriteDto;
import com.studentshub.service.application.FavoriteApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    private final FavoriteApplicationService favoriteApplicationService;

    public FavoriteController(FavoriteApplicationService favoriteApplicationService) {
        this.favoriteApplicationService = favoriteApplicationService;
    }
    
    // Test endpoint to check if the controller is responding
    @GetMapping("/test")
    public String testFavoritesEndpoint() {
        return "Favorites API is working!";
    }

    @GetMapping
    public List<DisplayFavoriteDto> listFavorites(@RequestParam Long userId) {
        return favoriteApplicationService.findByUserId(userId);
    }

    @GetMapping("/{id}")
    public DisplayFavoriteDto getFavorite(@PathVariable Long id) {
        return favoriteApplicationService.findById(id).orElse(null);
    }

    @PostMapping
    public DisplayFavoriteDto addFavorite(@RequestBody CreateFavoriteDto dto) {
        return favoriteApplicationService.save(dto);
    }

    @DeleteMapping("/{id}")
    public DisplayFavoriteDto deleteFavorite(@PathVariable Long id) {
        return favoriteApplicationService.deleteById(id).orElse(null);
    }
}
