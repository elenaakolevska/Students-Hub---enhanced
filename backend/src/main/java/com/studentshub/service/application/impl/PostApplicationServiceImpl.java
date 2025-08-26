package com.studentshub.service.application.impl;

import com.studentshub.dto.create.CreatePostDto;
import com.studentshub.dto.display.DisplayPostDto;
import com.studentshub.model.User;
import com.studentshub.model.enumerations.PostCategory;
import com.studentshub.service.domain.UserService;
import com.studentshub.service.application.PostApplicationService;
import com.studentshub.service.domain.PostService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostApplicationServiceImpl implements PostApplicationService {
    private final PostService postService;
    private final UserService userService;


    public PostApplicationServiceImpl(PostService postService, UserService userService) {
        this.postService = postService;
        this.userService = userService;
    }

    @Override
    public List<DisplayPostDto> findAll() {
        return postService.getLatestThreePosts().stream()
                .map(DisplayPostDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<DisplayPostDto> findById(Long id) {
        return postService.getPostById(id) != null ?
                Optional.of(DisplayPostDto.from(postService.getPostById(id))) :
                Optional.empty();
    }

    @Override
    public List<DisplayPostDto> findByOwnerUsername(String username) {
        return postService.getPostsByUsername(username).stream()
                .map(DisplayPostDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<DisplayPostDto> save(CreatePostDto createPostDto, String username) {
        User owner = userService.getUserByUsername(username);
        var post = postService.createPost(createPostDto.toPost(owner));
        return Optional.of(DisplayPostDto.from(post));
    }

    @Override
    public Optional<DisplayPostDto> update(Long id, CreatePostDto createPostDto) {
        var existingPost = postService.getPostById(id);
        if (existingPost != null) {
            var postToUpdate = createPostDto.toPost(existingPost.getOwner());
            postToUpdate.setId(id);
            var updatedPost = postService.updatePost(postToUpdate);
            return Optional.of(DisplayPostDto.from(updatedPost));
        }
        return Optional.empty();
    }

    @Override
    public void deleteById(Long id) {
        postService.deletePost(id);
    }

    @Override
    public Map<PostCategory, DisplayPostDto> getLatestPostPerCategory() {
        return postService.getLatestPostPerCategory().entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> DisplayPostDto.from(entry.getValue())
                ));
    }

    @Override
    public List<DisplayPostDto> findByUsername(String username) {
        return postService.getPostsByUsername(username).stream()
                .map(DisplayPostDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<DisplayPostDto> getLatestThreePosts() {
        return postService.getLatestThreePosts().stream()
                .map(DisplayPostDto::from)
                .collect(Collectors.toList());
    }
}
