package com.studentshub.service;

import com.studentshub.model.Post;
import com.studentshub.model.User;
import com.studentshub.model.enumerations.PostCategory;

import java.util.List;
import java.util.Map;

public interface PostService {
    Post createPost(Post post);
    Post getPostById(Long id);
    List<Post> getPostsByOwner(User owner);
    Post updatePost(Post post);
    void deletePost(Long id);
    Map<PostCategory, Post> getLatestPostPerCategory();
    List<Post> getPostsByUsername(String username);
    List<Post> getLatestThreePosts();

}

