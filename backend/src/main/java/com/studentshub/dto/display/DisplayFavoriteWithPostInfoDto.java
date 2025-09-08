package com.studentshub.dto.display;

import com.studentshub.model.Favorite;
import com.studentshub.model.Post;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record DisplayFavoriteWithPostInfoDto(
    Long id, 
    Long userId, 
    Long postId, 
    String postTitle, 
    String postDescription, 
    String postType, 
    LocalDateTime createdAt
) {
    public static DisplayFavoriteWithPostInfoDto from(Favorite favorite) {
        Post post = favorite.getPost();
        return new DisplayFavoriteWithPostInfoDto(
                favorite.getId(),
                favorite.getUser() != null ? favorite.getUser().getId() : null,
                post != null ? post.getId() : null,
                post != null ? post.getTitle() : null,
                post != null ? post.getDescription() : null,
                post != null ? post.getCategory().name() : null,
                favorite.getCreatedAt()
        );
    }

    public static List<DisplayFavoriteWithPostInfoDto> from(List<Favorite> favorites) {
        return favorites.stream().map(DisplayFavoriteWithPostInfoDto::from).collect(Collectors.toList());
    }
}
