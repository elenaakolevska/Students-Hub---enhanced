package com.studentshub.service.application.impl;

import com.studentshub.dto.create.CreateTransportPostDto;
import com.studentshub.dto.display.DisplayTransportPostDto;
import com.studentshub.model.User;
import com.studentshub.service.application.TransportPostApplicationService;
import com.studentshub.service.domain.TransportPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransportPostApplicationServiceImpl implements TransportPostApplicationService {
    private final TransportPostService transportPostService;
    private final UserService userService;

    public TransportPostApplicationServiceImpl(TransportPostService transportPostService, UserService userService) {
        this.transportPostService = transportPostService;
        this.userService = userService;
    }

    @Override
    public Optional<DisplayTransportPostDto> save(CreateTransportPostDto createTransportPostDto, String username) {
        User owner = userService.getUserByUsername(username);
        var transportPost = transportPostService.create(createTransportPostDto.toTransportPost(owner), username);
        return Optional.of(DisplayTransportPostDto.from(transportPost));
    }

    @Override
    public Optional<DisplayTransportPostDto> findById(Long id) {
        var transportPost = transportPostService.findById(id);
        return Optional.of(DisplayTransportPostDto.from(transportPost));
    }

    @Override
    public List<DisplayTransportPostDto> findAll() {
        return transportPostService.findAll().stream()
                .map(DisplayTransportPostDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<DisplayTransportPostDto> update(Long id, CreateTransportPostDto createTransportPostDto) {
        var existingPost = transportPostService.findById(id);
        if (existingPost != null) {
            var postToUpdate = createTransportPostDto.toTransportPost(existingPost.getOwner());
            var updatedPost = transportPostService.update(id, postToUpdate);
            return Optional.of(DisplayTransportPostDto.from(updatedPost));
        }
        return Optional.empty();
    }

    @Override
    public void deleteById(Long id) {
        transportPostService.delete(id);
    }

    @Override
    public List<DisplayTransportPostDto> findByLocationFromAndLocationTo(String locationFrom, String locationTo) {
        return transportPostService.findByLocationFromAndLocationTo(locationFrom, locationTo).stream()
                .map(DisplayTransportPostDto::from)
                .collect(Collectors.toList());
    }
}