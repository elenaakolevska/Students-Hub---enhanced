package com.studentshub.web;

import com.studentshub.dto.create.CreateFavoriteDto;
import com.studentshub.dto.display.DisplayFavoriteDto;
import com.studentshub.dto.display.DisplayFavoriteWithPostInfoDto;
import com.studentshub.service.application.FavoriteApplicationService;
import com.studentshub.service.domain.FavoriteService;
import com.studentshub.service.domain.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    private final FavoriteApplicationService favoriteApplicationService;
    private final UserService userService;
    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteApplicationService favoriteApplicationService, UserService userService, FavoriteService favoriteService) {
        this.favoriteApplicationService = favoriteApplicationService;
        this.userService = userService;
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<List<DisplayFavoriteWithPostInfoDto>> getUserFavorites(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        var user = userService.getUserByUsername(authentication.getName());
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        // Get favorites
        var favorites = favoriteService.getFavoritesByUser(user);
        // Convert to enhanced DTO with post info
        List<DisplayFavoriteWithPostInfoDto> favoritesWithInfo = DisplayFavoriteWithPostInfoDto.from(favorites);
        return ResponseEntity.ok(favoritesWithInfo);
    }

    @PostMapping("/add")
    public ResponseEntity<DisplayFavoriteDto> addToFavorites(@RequestBody CreateFavoriteDto createFavoriteDto,
                                                            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        var user = userService.getUserByUsername(authentication.getName());
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        CreateFavoriteDto favoriteWithUser = new CreateFavoriteDto(user.getId(), createFavoriteDto.postId(), LocalDateTime.now());
        DisplayFavoriteDto favorite = favoriteApplicationService.save(favoriteWithUser);
        return ResponseEntity.ok(favorite);
    }

    @PostMapping("/add/{postId}")
    public ResponseEntity<DisplayFavoriteDto> addToFavoritesByPostId(@PathVariable Long postId,
                                                                   Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        var user = userService.getUserByUsername(authentication.getName());
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        CreateFavoriteDto createFavoriteDto = new CreateFavoriteDto(user.getId(), postId, LocalDateTime.now());
        DisplayFavoriteDto favorite = favoriteApplicationService.save(createFavoriteDto);
        return ResponseEntity.ok(favorite);
    }

    @DeleteMapping("/{favoriteId}")
    public ResponseEntity<Void> removeFromFavorites(@PathVariable Long favoriteId,
                                                   Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        var favorite = favoriteApplicationService.findById(favoriteId);
        if (favorite.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var user = userService.getUserByUsername(authentication.getName());
        if (user == null || !favorite.get().userId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        favoriteApplicationService.deleteById(favoriteId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{postId}")
    public ResponseEntity<Boolean> isFavorite(@PathVariable Long postId,
                                            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        var user = userService.getUserByUsername(authentication.getName());
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<DisplayFavoriteDto> userFavorites = favoriteApplicationService.findByUserId(user.getId());
        boolean isFavorite = userFavorites.stream().anyMatch(fav -> fav.postId().equals(postId));
        return ResponseEntity.ok(isFavorite);
    }
}
