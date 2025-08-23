package com.studentshub.service.impl;

import com.studentshub.model.EventPost;
import com.studentshub.model.User;
import com.studentshub.model.enumerations.EventCategory;
import com.studentshub.model.exceptions.ResourceNotFoundException;
import com.studentshub.repository.EventPostRepository;
import com.studentshub.service.EventPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventPostServiceImpl implements EventPostService {

    private final EventPostRepository eventPostRepository;
    private  final UserService userService;

    public EventPostServiceImpl(EventPostRepository eventPostRepository, UserService userService) {
        this.eventPostRepository = eventPostRepository;
        this.userService = userService;
    }
    @Override
    public List<EventPost> getAllEventPosts() {
        return eventPostRepository.findAll();
    }

    @Override
    public EventPost createEventPost(EventPost post, String username) {
        User owner = userService.getUserByUsername(username);

        EventPost newPost = new EventPost();
        newPost.setEventCategory(post.getEventCategory());
        newPost.setLocation(post.getLocation());
        newPost.setFree(post.isFree());
        newPost.setPrice(post.getPrice());
        newPost.setOrganizer(post.getOrganizer());
        newPost.setImageUrl(post.getImageUrl());
        newPost.setTitle(post.getTitle());
        newPost.setDescription(post.getDescription());

        newPost.setOwner(owner);
        newPost.setCreatedAt(LocalDateTime.now());

        return eventPostRepository.save(newPost);
    }

    @Override
    public List<EventPost> getEventPostsByCategory(EventCategory category) {
        return eventPostRepository.findByEventCategory(category);
    }

    @Override
    public EventPost getEventPostById(Long id) {
        return eventPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event post not found with id " + id));
    }

    @Override
    public EventPost updateEventPost(Long id, EventPost updatedPost) {
        EventPost existingPost = eventPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EventPost not found with id: " + id));

        existingPost.setEventCategory(updatedPost.getEventCategory());
        existingPost.setDescription(updatedPost.getDescription());
        existingPost.setLocation(updatedPost.getLocation());
        existingPost.setFree(updatedPost.isFree());
        existingPost.setPrice(updatedPost.getPrice());
        existingPost.setOrganizer(updatedPost.getOrganizer());
        existingPost.setImageUrl(updatedPost.getImageUrl());
        existingPost.setTitle(updatedPost.getTitle());

        return eventPostRepository.save(existingPost);
    }

    @Override
    public void deleteEventPost(Long id) {
        eventPostRepository.deleteById(id);
    }
}

