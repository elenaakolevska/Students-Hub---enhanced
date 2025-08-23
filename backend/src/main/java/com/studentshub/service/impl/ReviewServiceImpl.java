package com.studentshub.service.impl;

import com.studentshub.model.Post;
import com.studentshub.model.Review;
import com.studentshub.model.User;
import com.studentshub.repository.ReviewRepository;
import com.studentshub.service.ReviewService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Override
    public Review addReview(User user, Post post, String content, Double rating) {
        Review review = new Review();
        review.setUser(user);
        review.setPost(post);
        review.setContent(content);
        review.setRating(rating);
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }
    @Override
    public List<Review> getReviewsByPost(Post post) {
        return reviewRepository.findByPost(post);
    }


}