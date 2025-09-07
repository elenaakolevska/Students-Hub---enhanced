package com.studentshub.dto.display;

import com.studentshub.model.TransportPost;

import java.time.LocalDateTime;
import java.util.List;

public record DisplayTransportPostDto(
        Long id,
        String title,
        String description,
        LocalDateTime departureDatetime,
        String providerName,
        String locationFrom,
        String locationTo,
        Integer price,
        String contactInfo,
        LocalDateTime createdAt,
        String ownerUsername,
        Long ownerId
) {
    public static DisplayTransportPostDto from(TransportPost post) {
        return new DisplayTransportPostDto(
                post.getId(),
                post.getTitle(),
                post.getDescription(),
                post.getDepartureDatetime(),
                post.getProviderName(),
                post.getLocationFrom(),
                post.getLocationTo(),
                post.getPrice(),
                post.getContactInfo(),
                post.getCreatedAt(),
                post.getOwner() != null ? post.getOwner().getUsername() : null,
                post.getOwner() != null ? post.getOwner().getId() : null
        );
    }

    public static List<DisplayTransportPostDto> from(List<TransportPost> posts) {
        return posts.stream().map(DisplayTransportPostDto::from).toList();
    }
}
