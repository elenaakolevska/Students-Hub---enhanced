package com.studentshub.dto.create;

import com.studentshub.model.Review;
import com.studentshub.model.User;
import com.studentshub.model.Post;
import java.time.LocalDateTime;

public record CreateReviewDto(Long userId, Long postId, String content, Double rating, LocalDateTime createdAt) {
    public Review toReview(User user, Post post) {
        return new Review(null, user, post, content, rating, createdAt);
    }
}

