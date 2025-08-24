package com.studentshub.dto.display;

import com.studentshub.model.Favorite;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record DisplayFavoriteDto(Long id, Long userId, Long postId, LocalDateTime createdAt) {
    public static DisplayFavoriteDto from(Favorite favorite) {
        return new DisplayFavoriteDto(
                favorite.getId(),
                favorite.getUser() != null ? favorite.getUser().getId() : null,
                favorite.getPost() != null ? favorite.getPost().getId() : null,
                favorite.getCreatedAt()
        );
    }

    public static List<DisplayFavoriteDto> from(List<Favorite> favorites) {
        return favorites.stream().map(DisplayFavoriteDto::from).collect(Collectors.toList());
    }
}

