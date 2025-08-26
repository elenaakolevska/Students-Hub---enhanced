package com.studentshub.service.domain;

import com.studentshub.model.Post;
import com.studentshub.model.Review;
import com.studentshub.model.User;

import java.util.List;

public interface ReviewService {
    Review addReview(User user, Post post, String content, Double rating);
    List<Review> getReviewsByPost(Post post);

    // CRUD methods
    List<Review> findAll();
    java.util.Optional<Review> findById(Long id);
    Review save(Review review);
    void deleteById(Long id);
}

