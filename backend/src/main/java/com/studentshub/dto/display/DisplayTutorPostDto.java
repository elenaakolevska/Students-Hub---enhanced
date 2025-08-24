package com.studentshub.dto.display;

import com.studentshub.model.TutorPost;

import java.time.LocalDateTime;
import java.util.List;

public record DisplayTutorPostDto(
        Long id,
        String title,
        String description,
        String tutorName,
        String faculty,
        boolean worksOnline,
        Integer price,
        String subject,
        LocalDateTime createdAt
) {
    public static DisplayTutorPostDto from(TutorPost post) {
        return new DisplayTutorPostDto(
                post.getId(),
                post.getTitle(),
                post.getDescription(),
                post.getTutorName(),
                post.getFaculty(),
                post.isWorksOnline(),
                post.getPrice(),
                post.getSubject(),
                post.getCreatedAt()
        );
    }

    public static List<DisplayTutorPostDto> from(List<TutorPost> posts) {
        return posts.stream().map(DisplayTutorPostDto::from).toList();
    }
}
