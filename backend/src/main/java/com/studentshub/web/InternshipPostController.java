package com.studentshub.web;

import com.studentshub.model.InternshipPost;
import com.studentshub.model.User;
import com.studentshub.model.enumerations.PostCategory;
import com.studentshub.service.FavoriteService;
import com.studentshub.service.InternshipPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/internship-posts")
public class InternshipPostController {

    private final InternshipPostService service;
    private final UserService userService;
    private final FavoriteService favoriteService;


    public InternshipPostController(InternshipPostService service, UserService userService, FavoriteService favoriteService) {
        this.service = service;
        this.userService = userService;
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public String listAll(@RequestParam(required = false) String faculty, Model model) {
        List<InternshipPost> posts;

        if (faculty != null && !faculty.isEmpty()) {
            posts = service.findByFacultyFilter(faculty);
        } else {
            posts = service.findAll();
        }

        model.addAttribute("posts", posts);
        return "internship-posts/list";
    }



    @GetMapping("/new")
    public String showCreateForm(Model model) {
        model.addAttribute("internshipPost", new InternshipPost());
        return "internship-posts/form";
    }

    @PostMapping
    public String create(@ModelAttribute InternshipPost internshipPost, Principal principal
    ) {
        service.create(internshipPost,principal.getName());
        return "redirect:/internship-posts";
    }

    @GetMapping("/{id}")
    public String showDetails(@PathVariable Long id, Model model) {
        InternshipPost post = service.findById(id);
        model.addAttribute("post", post);
        User currentUser = userService.getCurrentUser();
        model.addAttribute("currentUser", currentUser);
        return "internship-posts/details";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        InternshipPost post = service.findById(id);
        model.addAttribute("internshipPost", post);
        return "internship-posts/form";
    }

    @PostMapping("/update/{id}")
    public String update(@PathVariable Long id, @ModelAttribute InternshipPost internshipPost) {
        service.update(id, internshipPost);
        return "redirect:/internship-posts";
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        favoriteService.deleteAllByPostId(id);
        service.delete(id);
        return "redirect:/internship-posts";
    }
}
