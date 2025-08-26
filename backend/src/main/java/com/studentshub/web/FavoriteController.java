package com.studentshub.web;

import com.studentshub.dto.create.CreateFavoriteDto;
import com.studentshub.dto.display.DisplayFavoriteDto;
import com.studentshub.service.application.FavoriteApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
public class FavoriteController {
    private final FavoriteApplicationService favoriteApplicationService;

    public FavoriteController(FavoriteApplicationService favoriteApplicationService) {
        this.favoriteApplicationService = favoriteApplicationService;
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
