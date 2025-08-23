package com.studentshub.service;

import com.studentshub.model.Post;
import com.studentshub.model.Review;
import com.studentshub.model.User;

import java.util.List;

public interface ReviewService {
    Review addReview(User user, Post post, String content, Double rating);
    List<Review> getReviewsByPost(Post post);
}

