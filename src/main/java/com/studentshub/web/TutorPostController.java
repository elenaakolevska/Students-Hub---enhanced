package com.studentshub.web;

import com.studentshub.model.TutorPost;
import com.studentshub.model.User;
import com.studentshub.service.FavoriteService;
import com.studentshub.service.TutorPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/tutor-posts")
public class TutorPostController {

    private final TutorPostService tutorPostService;
    private final UserService userService;
    private final FavoriteService favoriteService;


    public TutorPostController(TutorPostService tutorPostService, UserService userService, FavoriteService favoriteService) {
        this.tutorPostService = tutorPostService;
        this.userService = userService;
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public String listTutorPosts(
            @RequestParam(required = false) String tutorName,
            @RequestParam(required = false) String subject,
            Model model) {

        List<TutorPost> posts = tutorPostService.findByTutorNameAndSubject(tutorName, subject);
        model.addAttribute("tutorPosts", posts);
        model.addAttribute("tutorName", tutorName);
        model.addAttribute("subject", subject);
        return "tutor-posts/list";
    }



    @GetMapping("/{id}")
    public String viewTutorPost(@PathVariable Long id, Model model) {
        TutorPost post = tutorPostService.findById(id);
        model.addAttribute("tutorPost", post);
        User currentUser = userService.getCurrentUser();
        model.addAttribute("currentUser", currentUser);
        return "tutor-posts/details";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("tutorPost", new TutorPost());
        return "tutor-posts/form";
    }

    @PostMapping
    public String createTutorPost(@ModelAttribute TutorPost tutorPost, Principal principal) {
        tutorPostService.create(tutorPost, principal.getName());
        return "redirect:/tutor-posts";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        TutorPost post = tutorPostService.findById(id);
        model.addAttribute("tutorPost", post);
        return "tutor-posts/form";
    }

    @PostMapping("/update")
    public String updateTutorPost(@ModelAttribute("tutorPost") TutorPost tutorPost) {
        tutorPostService.update(tutorPost.getId(), tutorPost);
        return "redirect:/tutor-posts";
    }

    @PostMapping("/delete/{id}")
    public String deleteTutorPost(@PathVariable Long id) {
        favoriteService.deleteAllByPostId(id);
        tutorPostService.delete(id);
        return "redirect:/tutor-posts";
    }
}
