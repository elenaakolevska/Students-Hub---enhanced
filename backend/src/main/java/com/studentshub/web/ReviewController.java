package com.studentshub.web;
import com.studentshub.dto.create.CreateReviewDto;
import com.studentshub.dto.display.DisplayReviewDto;
import com.studentshub.service.application.ReviewApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewApplicationService reviewApplicationService;

    public ReviewController(ReviewApplicationService reviewApplicationService) {
        this.reviewApplicationService = reviewApplicationService;
    }

    @PostMapping("/add")
    public DisplayReviewDto addReview(@RequestBody CreateReviewDto dto) {
        return reviewApplicationService.save(dto);
    }

    @GetMapping("/post/{postId}")
    public List<DisplayReviewDto> getReviewsByPost(@PathVariable Long postId) {
        return reviewApplicationService.findByPostId(postId);
    }
}
