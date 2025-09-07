package com.studentshub.dto.display;

import com.studentshub.model.InternshipPost;

import java.time.LocalDateTime;
import java.util.List;

public record DisplayInternshipPostDto(
        Long id,
        String title,
        String description,
        String company,
        String facultyFilter,
        String position,
        String logoUrl,
        LocalDateTime createdAt,
        String ownerUsername,
        Long ownerId
) {
    public static DisplayInternshipPostDto from(InternshipPost post) {
        return new DisplayInternshipPostDto(
                post.getId(),
                post.getTitle(),
                post.getDescription(),
                post.getCompany(),
                post.getFacultyFilter(),
                post.getPosition(),
                post.getLogoUrl(),
                post.getCreatedAt(),
                post.getOwner() != null ? post.getOwner().getUsername() : null,
                post.getOwner() != null ? post.getOwner().getId() : null
        );
    }

    public static List<DisplayInternshipPostDto> from(List<InternshipPost> posts) {
        return posts.stream().map(DisplayInternshipPostDto::from).toList();
    }
}
