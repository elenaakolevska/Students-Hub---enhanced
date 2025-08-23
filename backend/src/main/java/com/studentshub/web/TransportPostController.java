package com.studentshub.web;

import com.studentshub.model.TransportPost;
import com.studentshub.model.User;
import com.studentshub.service.FavoriteService;
import com.studentshub.service.TransportPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
@RequestMapping("/transport-posts")
public class TransportPostController {

    private final TransportPostService transportPostService;
    private final UserService userService;
    private final FavoriteService favoriteService;


    public TransportPostController(TransportPostService transportPostService, UserService userService, FavoriteService favoriteService) {
        this.transportPostService = transportPostService;
        this.userService = userService;
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public String listAll(
            @RequestParam(required = false) String locationFrom,
            @RequestParam(required = false) String locationTo,
            Model model) {

        var filteredPosts = transportPostService.findByLocationFromAndLocationTo(locationFrom, locationTo);

        model.addAttribute("transportPosts", filteredPosts);
        return "transport-posts/list";
    }

    @GetMapping("/{id}")
    public String viewTransportPost(@PathVariable Long id, Model model) {
        TransportPost transportPost = transportPostService.findById(id);
        model.addAttribute("transportPost", transportPost);

        User currentUser = userService.getCurrentUser();
        model.addAttribute("currentUser", currentUser);

        return "transport-posts/details";
    }


    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("transportPost", new TransportPost());
        return "transport-posts/form";
    }

    @PostMapping("/create")
    public String createPost(@ModelAttribute TransportPost transportPost, Principal principal) {
        transportPostService.create(transportPost, principal.getName());
        return "redirect:/transport-posts";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        TransportPost post = transportPostService.findById(id);
        model.addAttribute("transportPost", post);
        return "transport-posts/form";
    }

    @PostMapping("/update")
    public String updatePost(@ModelAttribute TransportPost transportPost) {
        transportPostService.update(transportPost.getId(), transportPost);
        return "redirect:/transport-posts";
    }

    @PostMapping("/delete/{id}")
    public String deletePost(@PathVariable Long id) {
        favoriteService.deleteAllByPostId(id);
        transportPostService.delete(id);
        return "redirect:/transport-posts";
    }
}
