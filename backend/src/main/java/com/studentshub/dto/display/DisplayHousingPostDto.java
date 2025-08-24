package com.studentshub.dto.display;

import com.studentshub.model.HousingPost;

import java.time.LocalDateTime;
import java.util.List;

public record DisplayHousingPostDto(
        Long id,
        String title,
        String description,
        String municipality,
        String location,
        Integer price,
        List<String> images,
        boolean isFound,
        LocalDateTime createdAt
) {
    public static DisplayHousingPostDto from(HousingPost post) {
        return new DisplayHousingPostDto(
                post.getId(),
                post.getTitle(),
                post.getDescription(),
                post.getMunicipality(),
                post.getLocation(),
                post.getPrice(),
                post.getImages(),
                post.isFound(),
                post.getCreatedAt()
        );
    }

    public static List<DisplayHousingPostDto> from(List<HousingPost> posts) {
        return posts.stream().map(DisplayHousingPostDto::from).toList();
    }
}
