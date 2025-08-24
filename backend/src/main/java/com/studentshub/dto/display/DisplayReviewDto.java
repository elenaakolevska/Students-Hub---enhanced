package com.studentshub.dto.display;

import com.studentshub.model.Review;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record DisplayReviewDto(Long id, Long userId, Long postId, String content, Double rating, LocalDateTime createdAt) {
    public static DisplayReviewDto from(Review review) {
        return new DisplayReviewDto(
            review.getId(),
            review.getUser() != null ? review.getUser().getId() : null,
            review.getPost() != null ? review.getPost().getId() : null,
            review.getContent(),
            review.getRating(),
            review.getCreatedAt()
        );
    }
    public static List<DisplayReviewDto> from(List<Review> reviews) {
        return reviews.stream().map(DisplayReviewDto::from).collect(Collectors.toList());
    }
}

