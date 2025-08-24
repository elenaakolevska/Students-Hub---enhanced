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
        LocalDateTime createdAt
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
                post.getCreatedAt()
        );
    }

    public static List<DisplayMaterialPostDto> from(List<MaterialPost> posts) {
        return posts.stream().map(DisplayMaterialPostDto::from).toList();
    }
}
