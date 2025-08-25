package com.studentshub.service.application.impl;

import com.studentshub.dto.create.CreateEventPostDto;
import com.studentshub.dto.display.DisplayEventPostDto;
import com.studentshub.model.User;
import com.studentshub.model.enumerations.EventCategory;
import com.studentshub.service.application.EventPostApplicationService;
import com.studentshub.service.domain.EventPostService;
import com.studentshub.service.domain.UserService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventPostApplicationServiceImpl implements EventPostApplicationService {
    private final EventPostService eventPostService;
    private final UserService userService;

    public EventPostApplicationServiceImpl(EventPostService eventPostService, UserService userService) {
        this.eventPostService = eventPostService;
        this.userService = userService;
    }

    @Override
    public List<DisplayEventPostDto> findAll() {
        return eventPostService.getAllEventPosts().stream()
                .map(DisplayEventPostDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<DisplayEventPostDto> findByEventCategory(EventCategory category) {
        return eventPostService.getEventPostsByCategory(category).stream()
                .map(DisplayEventPostDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<DisplayEventPostDto> findById(Long id) {
        var eventPost = eventPostService.getEventPostById(id);
        return eventPost != null ? Optional.of(DisplayEventPostDto.from(eventPost)) : Optional.empty();
    }

    @Override
    public Optional<DisplayEventPostDto> save(CreateEventPostDto createEventPostDto, String username) {
        User owner = userService.getUserByUsername(username);
        var eventPost = eventPostService.createEventPost(createEventPostDto.toEventPost(owner), username);
        return Optional.of(DisplayEventPostDto.from(eventPost));
    }

    @Override
    public Optional<DisplayEventPostDto> update(Long id, CreateEventPostDto createEventPostDto) {
        var existingPost = eventPostService.getEventPostById(id);
        if (existingPost != null) {
            var postToUpdate = createEventPostDto.toEventPost(existingPost.getOwner());
            var updatedPost = eventPostService.updateEventPost(id, postToUpdate);
            return Optional.of(DisplayEventPostDto.from(updatedPost));
        }
        return Optional.empty();
    }

    @Override
    public void deleteById(Long id) {
        eventPostService.deleteEventPost(id);
    }
}