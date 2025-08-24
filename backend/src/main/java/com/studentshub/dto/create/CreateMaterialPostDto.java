package com.studentshub.dto.create;

import com.studentshub.model.MaterialPost;
import com.studentshub.model.User;

import java.util.List;

public record CreateMaterialPostDto(
        String title,
        String description,
        Double rating,
        String fileUrl,
        String originalFileName,
        String subject
) {
    public MaterialPost toMaterialPost(User owner) {
        MaterialPost post = new MaterialPost();
        post.setTitle(title);
        post.setDescription(description);
        post.setRating(rating);
        post.setFileUrl(fileUrl);
        post.setOriginalFileName(originalFileName);
        post.setSubject(subject);
        post.setOwner(owner);
        return post;
    }
}
