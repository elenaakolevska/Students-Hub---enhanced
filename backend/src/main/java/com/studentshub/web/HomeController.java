package com.studentshub.web;

import com.studentshub.model.enumerations.PostCategory;
import com.studentshub.service.PostService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    private final PostService postService;

    public HomeController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("categories", PostCategory.values());

        model.addAttribute("latestPosts", postService.getLatestThreePosts());
        return "home";
    }

    @GetMapping("/about")
    public String about() {
        return "about";
    }
}
