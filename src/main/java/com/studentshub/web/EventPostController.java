package com.studentshub.web;

import com.studentshub.model.EventPost;
import com.studentshub.model.User;
import com.studentshub.model.enumerations.EventCategory;
import com.studentshub.service.EventPostService;
import com.studentshub.service.FavoriteService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/event-posts")
public class EventPostController {

    private final EventPostService eventPostService;
    private final UserService userService;
    private final FavoriteService favoriteService;

    public EventPostController(EventPostService eventPostService, UserService userService, FavoriteService favoriteService) {
        this.eventPostService = eventPostService;
        this.userService = userService;
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public String listEventPosts(@RequestParam(required = false) EventCategory category, Model model) {
        List<EventPost> posts = (category == null) ?
                eventPostService.getAllEventPosts() :
                eventPostService.getEventPostsByCategory(category);
        model.addAttribute("eventPosts", posts);
        return "event-posts/list";
    }


    @GetMapping("/{id}")
    public String viewEventPost(@PathVariable Long id, Model model) {
        model.addAttribute("eventPost", eventPostService.getEventPostById(id));
        User currentUser = userService.getCurrentUser();
        model.addAttribute("currentUser", currentUser);
        return "event-posts/details";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("eventPost", new EventPost());
        model.addAttribute("categories", EventCategory.values());


        return "event-posts/form";
    }

    @PostMapping
    public String createEventPost(@ModelAttribute EventPost post, Principal principal) {
        eventPostService.createEventPost(post, principal.getName());
        return "redirect:/event-posts";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        model.addAttribute("eventPost", eventPostService.getEventPostById(id));
        model.addAttribute("categories", EventCategory.values());

        return "event-posts/form";
    }

    @PostMapping("/update")
    public String updateEventPost(@ModelAttribute("eventPost") EventPost eventPost) {
        eventPostService.updateEventPost(eventPost.getId(), eventPost);
        return "redirect:/event-posts";
    }


    @PostMapping("/delete/{id}")
    public String deleteEventPost(@PathVariable Long id) {
        favoriteService.deleteAllByPostId(id);
        eventPostService.deleteEventPost(id);
        return "redirect:/event-posts";
    }
}

