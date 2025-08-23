package com.studentshub.web;

import com.studentshub.model.*;
import com.studentshub.service.FavoriteService;
import com.studentshub.service.PostService;
import com.studentshub.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserService userService;
    private final PostService postService;

    public FavoriteController(FavoriteService favoriteService, UserService userService, PostService postService) {
        this.favoriteService = favoriteService;
        this.userService = userService;
        this.postService = postService;
    }

    @GetMapping
    public String listFavorites(Model model,
                                @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByUsername(userDetails.getUsername());
        model.addAttribute("favorites", favoriteService.getFavoritesByUser(user));
        return "favorites/list";
    }


    @GetMapping("/favorites/add/{postId}")
    public String addFavorite(@PathVariable Long postId,
                              @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByUsername(userDetails.getUsername());
        Post post = postService.getPostById(postId);
        favoriteService.addFavorite(user, post);
        return "redirect:/favorites";
    }


    @PostMapping("/remove/{id}")
    public String removeFavorite(@PathVariable Long id) {
        favoriteService.removeFavorite(id);
        return "redirect:/favorites";
    }
}

