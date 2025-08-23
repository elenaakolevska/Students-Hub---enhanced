package com.studentshub.service.impl;

import com.studentshub.model.Post;
import com.studentshub.model.User;
import com.studentshub.model.enumerations.PostCategory;
import com.studentshub.model.exceptions.PostNotFoundException;
import com.studentshub.repository.PostRepository;
import com.studentshub.service.PostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserService userService;

    public PostServiceImpl(PostRepository postRepository, UserService userService) {
        this.postRepository = postRepository;
        this.userService = userService;
    }

    @Override
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(id));
    }

    @Override
    public List<Post> getPostsByOwner(User owner) {
        return postRepository.findByOwner(owner);
    }

    @Override
    public Post updatePost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    @Override
    public Map<PostCategory, Post> getLatestPostPerCategory() {
        Map<PostCategory, Post> result = new EnumMap<>(PostCategory.class);
        for (PostCategory category : PostCategory.values()) {
            postRepository.findTopByCategoryOrderByCreatedAtDesc(category)
                    .ifPresent(post -> result.put(category, post));
        }
        return result;
    }
    @Override
    public List<Post> getPostsByUsername(String username) {
        User user = userService.getUserByUsername(username);
        return postRepository.findAllByOwner(user);
    }
    @Override
    public List<Post> getLatestThreePosts() {
        return postRepository.findTop3ByOrderByCreatedAtDesc();
    }


}
