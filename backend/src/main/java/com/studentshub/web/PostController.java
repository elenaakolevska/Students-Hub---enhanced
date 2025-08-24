package com.studentshub.web;

import com.studentshub.dto.create.CreatePostDto;
import com.studentshub.dto.display.DisplayPostDto;
import com.studentshub.model.enumerations.PostCategory;
import com.studentshub.service.application.PostApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostApplicationService postApplicationService;

    public PostController(PostApplicationService postApplicationService) {
        this.postApplicationService = postApplicationService;
    }

    @GetMapping
    public List<DisplayPostDto> findAll() {
        return postApplicationService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayPostDto> findById(@PathVariable Long id) {
        return postApplicationService.findById(id)
                .map(post -> ResponseEntity.ok().body(post))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<DisplayPostDto> save(@RequestBody CreatePostDto createPostDto,
                                               Authentication authentication) {
        return postApplicationService.save(createPostDto, authentication.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<DisplayPostDto> update(@PathVariable Long id,
                                                 @RequestBody CreatePostDto createPostDto) {
        return postApplicationService.update(id, createPostDto)
                .map(post -> ResponseEntity.ok().body(post))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        if (postApplicationService.findById(id).isPresent()) {
            postApplicationService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{username}")
    public List<DisplayPostDto> findByUsername(@PathVariable String username) {
        return postApplicationService.findByUsername(username);
    }

    @GetMapping("/my-posts")
    public List<DisplayPostDto> getMyPosts(Authentication authentication) {
        return postApplicationService.findByUsername(authentication.getName());
    }

    @GetMapping("/latest")
    public List<DisplayPostDto> getLatestPosts() {
        return postApplicationService.getLatestThreePosts();
    }

    @GetMapping("/latest-per-category")
    public Map<PostCategory, DisplayPostDto> getLatestPostPerCategory() {
        return postApplicationService.getLatestPostPerCategory();
    }
}
