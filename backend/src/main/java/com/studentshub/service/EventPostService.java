package com.studentshub.service;

import com.studentshub.model.enumerations.EventCategory;
import com.studentshub.model.EventPost;

import java.util.List;

public interface EventPostService {
    List<EventPost> getAllEventPosts();
    List<EventPost> getEventPostsByCategory(EventCategory category);
    EventPost getEventPostById(Long id);
    EventPost updateEventPost(Long id, EventPost eventPost);
    EventPost createEventPost(EventPost post, String username);
    void deleteEventPost(Long id);
}

