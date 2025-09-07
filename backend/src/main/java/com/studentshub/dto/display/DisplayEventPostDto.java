package com.studentshub.dto.display;

import com.studentshub.model.EventPost;
import com.studentshub.model.enumerations.EventCategory;

import java.time.LocalDateTime;
import java.util.List;

public record DisplayEventPostDto(
        Long id,
        String title,
        String description,
        EventCategory eventCategory,
        String location,
        boolean isFree,
        Integer price,
        String organizer,
        String imageUrl,
        LocalDateTime createdAt,
        String ownerUsername,
        Long ownerId
) {
    public static DisplayEventPostDto from(EventPost post) {
        return new DisplayEventPostDto(
                post.getId(),
                post.getTitle(),
                post.getDescription(),
                post.getEventCategory(),
                post.getLocation(),
                post.isFree(),
                post.getPrice(),
                post.getOrganizer(),
                post.getImageUrl(),
                post.getCreatedAt(),
                post.getOwner() != null ? post.getOwner().getUsername() : null,
                post.getOwner() != null ? post.getOwner().getId() : null
        );
    }

    public static List<DisplayEventPostDto> from(List<EventPost> posts) {
        return posts.stream().map(DisplayEventPostDto::from).toList();
    }
}
