package com.studentshub.dto.create;

import com.studentshub.model.TransportPost;
import com.studentshub.model.User;

import java.time.LocalDateTime;

public record CreateTransportPostDto(
        String title,
        String description,
        LocalDateTime departureDatetime,
        String providerName,
        String locationFrom,
        String locationTo,
        Integer price,
        String contactInfo
) {
    public TransportPost toTransportPost(User owner) {
        TransportPost post = new TransportPost(
                departureDatetime,
                providerName,
                locationFrom,
                locationTo,
                price,
                contactInfo
        );
        post.setTitle(title);
        post.setDescription(description);
        post.setOwner(owner);
        return post;
    }
}
