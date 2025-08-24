package com.studentshub.dto.create;

import com.studentshub.model.Post;
import com.studentshub.model.User;
import com.studentshub.model.enumerations.PostCategory;

public record CreatePostDto(
        String title,
        String description,
        PostCategory category
) {
    public Post toPost(User owner) {
        Post post = new Post() {};
        post.setTitle(title);
        post.setDescription(description);
        post.setCategory(category);
        post.setOwner(owner);
        return post;
    }
}
