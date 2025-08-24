package com.studentshub.dto.display;

import com.studentshub.model.Post;
import com.studentshub.model.enumerations.PostCategory;

import java.time.LocalDateTime;
import java.util.List;

public record DisplayPostDto(
        Long id,
        String title,
        String description,
        LocalDateTime createdAt,
        String ownerUsername,
        PostCategory category
) {
    public static DisplayPostDto from(Post post) {
        return new DisplayPostDto(
                post.getId(),
                post.getTitle(),
                post.getDescription(),
                post.getCreatedAt(),
                post.getOwner() != null ? post.getOwner().getUsername() : null,
                post.getCategory()
        );
    }

    public static List<DisplayPostDto> from(List<Post> posts) {
        return posts.stream().map(DisplayPostDto::from).toList();
    }
}
