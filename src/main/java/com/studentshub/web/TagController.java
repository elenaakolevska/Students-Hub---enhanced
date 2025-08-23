package com.studentshub.web;
import com.studentshub.model.*;
import com.studentshub.service.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
@Controller
@RequestMapping("/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public String listTags(Model model) {
        model.addAttribute("tags", tagService.getAllTags());
        return "tags/list";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("tag", new Tag());
        return "tags/create";
    }

    @PostMapping("/create")
    public String createTag(@ModelAttribute Tag tag) {
        tagService.createTag(tag);
        return "redirect:/tags";
    }

    @GetMapping("/{id}")
    public String getTagDetails(@PathVariable Long id, Model model) {
        Tag tag = tagService.getTagById(id);
        model.addAttribute("tag", tag);
        return "tags/details";
    }
}
