package com.studentshub.dto.create;

import com.studentshub.model.HousingPost;
import com.studentshub.model.User;

import java.util.List;

public record CreateHousingPostDto(
        String title,
        String description,
        String municipality,
        String location,
        Integer price,
        List<String> images,
        boolean isFound
) {
    public HousingPost toHousingPost(User owner) {
        HousingPost post = new HousingPost();
        post.setTitle(title);
        post.setDescription(description);
        post.setMunicipality(municipality);
        post.setLocation(location);
        post.setPrice(price);
        post.setImages(images);
        post.setFound(isFound);
        post.setOwner(owner);
        return post;
    }
}

