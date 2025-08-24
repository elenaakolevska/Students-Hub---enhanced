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
        LocalDateTime createdAt
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
                post.getCreatedAt()
        );
    }

    public static List<DisplayTransportPostDto> from(List<TransportPost> posts) {
        return posts.stream().map(DisplayTransportPostDto::from).toList();
    }
}
