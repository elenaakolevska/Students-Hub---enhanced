package com.studentshub.service.application.impl;

import com.studentshub.dto.create.CreateFavoriteDto;
import com.studentshub.dto.display.DisplayFavoriteDto;
import com.studentshub.model.Favorite;
import com.studentshub.model.User;
import com.studentshub.model.Post;
import com.studentshub.service.domain.UserService;
import com.studentshub.service.domain.PostService;
import com.studentshub.service.application.FavoriteApplicationService;
import org.springframework.stereotype.Service;
import com.studentshub.service.domain.FavoriteService;

import java.util.List;
import java.util.Optional;

@Service
public class FavoriteApplicationServiceImpl implements FavoriteApplicationService {
    private final FavoriteService favoriteService;
    private final UserService userService;
    private final PostService postService;

    public FavoriteApplicationServiceImpl(FavoriteService favoriteService, UserService userService, PostService postService) {
        this.favoriteService = favoriteService;
        this.userService = userService;
        this.postService = postService;
    }

    @Override
    public List<DisplayFavoriteDto> findAll() {
        // Not supported by FavoriteServiceImpl, so return all for all users
        return userService.findAll().stream()
            .flatMap(user -> favoriteService.getFavoritesByUser(user).stream())
            .map(DisplayFavoriteDto::from)
            .toList();
    }

    @Override
    public Optional<DisplayFavoriteDto> findById(Long id) {
        // Not directly supported, so search all users' favorites
        return userService.findAll().stream()
            .flatMap(user -> favoriteService.getFavoritesByUser(user).stream())
            .filter(fav -> fav.getId().equals(id))
            .findFirst()
            .map(DisplayFavoriteDto::from);
    }

    @Override
    public DisplayFavoriteDto save(CreateFavoriteDto dto) {
        User user = userService.getUserById(dto.userId());
        Post post = postService.getPostById(dto.postId());
        Favorite favorite = favoriteService.addFavorite(user, post);
        return DisplayFavoriteDto.from(favorite);
    }

    @Override
    public Optional<DisplayFavoriteDto> update(Long id, CreateFavoriteDto dto) {
        // Remove old favorite and add new one
        findById(id).ifPresent(fav -> favoriteService.removeFavorite(id));
        return Optional.of(save(dto));
    }

    @Override
    public Optional<DisplayFavoriteDto> deleteById(Long id) {
        Optional<DisplayFavoriteDto> fav = findById(id);
        fav.ifPresent(f -> favoriteService.removeFavorite(id));
        return fav;
    }

    @Override
    public List<DisplayFavoriteDto> findByUserId(Long userId) {
        User user = userService.getUserById(userId);
        return favoriteService.getFavoritesByUser(user).stream()
            .map(DisplayFavoriteDto::from)
            .toList();
    }

    @Override
    public void deleteAllByPostId(Long postId) {
        favoriteService.deleteAllByPostId(postId);
    }
}

