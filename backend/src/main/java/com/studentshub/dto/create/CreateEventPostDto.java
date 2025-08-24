package com.studentshub.dto.create;

import com.studentshub.model.EventPost;
import com.studentshub.model.User;
import com.studentshub.model.enumerations.EventCategory;

public record CreateEventPostDto(
        String title,
        String description,
        EventCategory eventCategory,
        String location,
        boolean isFree,
        Integer price,
        String organizer,
        String imageUrl
) {
    public EventPost toEventPost(User owner) {
        EventPost post = new EventPost();
        post.setTitle(title);
        post.setDescription(description);
        post.setEventCategory(eventCategory);
        post.setLocation(location);
        post.setFree(isFree);
        post.setPrice(price);
        post.setOrganizer(organizer);
        post.setImageUrl(imageUrl);
        post.setOwner(owner);
        return post;
    }
}
