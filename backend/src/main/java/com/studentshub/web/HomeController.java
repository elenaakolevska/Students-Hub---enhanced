package com.studentshub.web;

import com.studentshub.dto.display.DisplayPostDto;
import com.studentshub.model.enumerations.PostCategory;
import com.studentshub.service.application.PostApplicationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/home")
public class HomeController {
    private final PostApplicationService postApplicationService;

    public HomeController(PostApplicationService postApplicationService) {
        this.postApplicationService = postApplicationService;
    }

    @GetMapping("/categories")
    public PostCategory[] getCategories() {
        return PostCategory.values();
    }

    @GetMapping("/latest-posts")
    public List<DisplayPostDto> getLatestPosts() {
        return postApplicationService.getLatestThreePosts();
    }

    @GetMapping("/about")
    public String about() {
        return "About StudentsHub";
    }
}
