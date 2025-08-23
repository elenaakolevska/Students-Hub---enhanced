package com.studentshub.web;
import com.studentshub.model.*;
import com.studentshub.service.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final PostService postService;
    private final UserService userService;

    public ReviewController(ReviewService reviewService, PostService postService, UserService userService) {
        this.reviewService = reviewService;
        this.postService = postService;
        this.userService = userService;
    }

    @PostMapping("/add")
    public String addReview(@RequestParam Long userId,
                            @RequestParam Long postId,
                            @RequestParam String content,
                            @RequestParam Double rating) {
        User user = userService.getUserById(userId);
        Post post = postService.getPostById(postId);
        reviewService.addReview(user, post, content, rating);
        return "redirect:/posts/" + postId;
    }

    @GetMapping("/post/{postId}")
    public String getReviewsByPost(@PathVariable Long postId, Model model) {
        Post post = postService.getPostById(postId);
        List<Review> reviews = reviewService.getReviewsByPost(post);
        model.addAttribute("post", post);
        model.addAttribute("reviews", reviews);
        return "reviews/list";
    }
}

