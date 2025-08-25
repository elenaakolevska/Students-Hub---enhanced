package com.studentshub.service.application.impl;

import com.studentshub.dto.create.CreateReviewDto;
import com.studentshub.dto.display.DisplayReviewDto;
import com.studentshub.model.Review;
import com.studentshub.service.domain.ReviewService;
import com.studentshub.service.application.ReviewApplicationService;
import com.studentshub.service.domain.UserService;
import com.studentshub.service.domain.PostService;
import com.studentshub.model.User;
import com.studentshub.model.Post;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewApplicationServiceImpl implements ReviewApplicationService {

    private final ReviewService reviewService;
    private final UserService userService;
    private final PostService postService;

    public ReviewApplicationServiceImpl(ReviewService reviewService, UserService userService, PostService postService) {
        this.reviewService = reviewService;
        this.userService = userService;
        this.postService = postService;
    }

    @Override
    public List<DisplayReviewDto> findAll() {
        return reviewService.findAll().stream()
                .map(review -> DisplayReviewDto.from(review))
                .toList();
    }

    @Override
    public Optional<DisplayReviewDto> findById(Long id) {
        return reviewService.findById(id).map(review -> DisplayReviewDto.from(review));
    }

    @Override
    public DisplayReviewDto save(CreateReviewDto dto) {
        User user = userService.getUserById(dto.userId());
        Post post = postService.getPostById(dto.postId());
        Review review = dto.toReview(user, post);
        Review saved = reviewService.save(review);
        return DisplayReviewDto.from(saved);
    }

    @Override
    public Optional<DisplayReviewDto> update(Long id, CreateReviewDto dto) {
        Optional<Review> existing = reviewService.findById(id);
        if (existing.isPresent()) {
            User user = userService.getUserById(dto.userId());
            Post post = postService.getPostById(dto.postId());
            Review review = dto.toReview(user, post);
            // If Review has setId, use it. Otherwise, create a new Review with the same id.
            try {
                review.getClass().getMethod("setId", Long.class).invoke(review, id);
            } catch (Exception ignored) {}
            Review updated = reviewService.save(review);
            return Optional.of(DisplayReviewDto.from(updated));
        }
        return Optional.empty();
    }

    @Override
    public Optional<DisplayReviewDto> deleteById(Long id) {
        Optional<Review> review = reviewService.findById(id);
        review.ifPresent(r -> reviewService.deleteById(id));
        return review.map(r -> DisplayReviewDto.from(r));
    }

    @Override
    public List<DisplayReviewDto> findByPostId(Long postId) {
        Post post = postService.getPostById(postId);
        return reviewService.getReviewsByPost(post).stream()
                .map(review -> DisplayReviewDto.from(review))
                .toList();
    }
}
