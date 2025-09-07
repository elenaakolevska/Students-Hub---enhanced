package com.studentshub.dto.display;

import com.studentshub.model.MaterialPost;

import java.time.LocalDateTime;
import java.util.List;

public record DisplayMaterialPostDto(
        Long id,
        String title,
        String description,
        Double rating,
        String fileUrl,
        String originalFileName,
        String subject,
        LocalDateTime createdAt,
        String ownerUsername,
        Long ownerId
) {
    public static DisplayMaterialPostDto from(MaterialPost post) {
        return new DisplayMaterialPostDto(
                post.getId(),
                post.getTitle(),
                post.getDescription(),
                post.getRating(),
                post.getFileUrl(),
                post.getOriginalFileName(),
                post.getSubject(),
                post.getCreatedAt(),
                post.getOwner() != null ? post.getOwner().getUsername() : null,
                post.getOwner() != null ? post.getOwner().getId() : null
        );
    }

    public static List<DisplayMaterialPostDto> from(List<MaterialPost> posts) {
        return posts.stream().map(DisplayMaterialPostDto::from).toList();
    }
}
