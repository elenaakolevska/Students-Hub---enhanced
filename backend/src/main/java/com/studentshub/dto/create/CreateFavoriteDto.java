package com.studentshub.dto.create;

import com.studentshub.model.Favorite;
import com.studentshub.model.Post;
import com.studentshub.model.User;

import java.time.LocalDateTime;

public record CreateFavoriteDto(Long userId, Long postId, LocalDateTime createdAt) {
    public Favorite toFavorite(User user, Post post) {
        return new Favorite(null, user, post, createdAt);
    }
}

