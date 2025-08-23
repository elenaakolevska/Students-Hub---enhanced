package com.studentshub.web;

import com.studentshub.model.HousingPost;
import com.studentshub.model.User;
import com.studentshub.service.FavoriteService;
import com.studentshub.service.HousingPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/housing-posts")
public class HousingPostController {

    private final HousingPostService service;
    private final UserService userService;
    private final FavoriteService favoriteService;


    public HousingPostController(HousingPostService service, UserService userService, FavoriteService favoriteService) {
        this.service = service;
        this.userService = userService;
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public String getAll(@RequestParam(required = false) String municipality, Model model) {
        List<HousingPost> posts;

        if (municipality != null && !municipality.isEmpty()) {
            posts = service.findByMunicipality(municipality);
        } else {
            posts = service.findAll();
        }

        model.addAttribute("posts", posts);
        model.addAttribute("municipalities", service.getAllMunicipalities());
        return "housing-posts/list";
    }

    @GetMapping("/{id}")
    public String getById(@PathVariable Long id, Model model) {
        HousingPost post = service.findById(id);
        model.addAttribute("post", post);
        User currentUser = userService.getCurrentUser();
        model.addAttribute("currentUser", currentUser);
        return "housing-posts/details";
    }




    @PostMapping
    public String create(@ModelAttribute HousingPost post, Principal principal
    ) {
        service.create(post,principal.getName());
        return "redirect:/housing-posts";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("post", new HousingPost());
        model.addAttribute("municipalities", service.getAllMunicipalities());

        return "housing-posts/form";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        HousingPost post = service.findById(id);
        String imagesAsString = String.join(", ", post.getImages());
        model.addAttribute("post", post);
        model.addAttribute("imagesAsString", imagesAsString);
        model.addAttribute("municipalities", service.getAllMunicipalities());
        return "housing-posts/form";
    }



    @PostMapping("/update/{id}")
    public String update(@PathVariable Long id, @ModelAttribute HousingPost post, @RequestParam String images) {
        List<String> imagesList = Arrays.stream(images.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
        post.setImages(imagesList);
        service.update(id, post);
        return "redirect:/housing-posts";
    }


    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        favoriteService.deleteAllByPostId(id);
        service.delete(id);
        return "redirect:/housing-posts";
    }
}
