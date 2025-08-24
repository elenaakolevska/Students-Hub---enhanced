package com.studentshub.service.application.impl;

import com.studentshub.dto.create.CreateTutorPostDto;
import com.studentshub.dto.display.DisplayTutorPostDto;
import com.studentshub.model.User;
import com.studentshub.service.application.TutorPostApplicationService;
import com.studentshub.service.domain.TutorPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TutorPostApplicationServiceImpl implements TutorPostApplicationService {
    private final TutorPostService tutorPostService;
    private final UserService userService;

    public TutorPostApplicationServiceImpl(TutorPostService tutorPostService, UserService userService) {
        this.tutorPostService = tutorPostService;
        this.userService = userService;
    }

    @Override
    public Optional<DisplayTutorPostDto> save(CreateTutorPostDto createTutorPostDto, String username) {
        User owner = userService.getUserByUsername(username);
        var tutorPost = tutorPostService.create(createTutorPostDto.toTutorPost(owner), username);
        return Optional.of(DisplayTutorPostDto.from(tutorPost));
    }

    @Override
    public Optional<DisplayTutorPostDto> findById(Long id) {
        var tutorPost = tutorPostService.findById(id);
        return Optional.of(DisplayTutorPostDto.from(tutorPost));
    }

    @Override
    public List<DisplayTutorPostDto> findAll() {
        return tutorPostService.findAll().stream()
                .map(DisplayTutorPostDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<DisplayTutorPostDto> update(Long id, CreateTutorPostDto createTutorPostDto) {
        var existingPost = tutorPostService.findById(id);
        if (existingPost != null) {
            var postToUpdate = createTutorPostDto.toTutorPost(existingPost.getOwner());
            var updatedPost = tutorPostService.update(id, postToUpdate);
            return Optional.of(DisplayTutorPostDto.from(updatedPost));
        }
        return Optional.empty();
    }

    @Override
    public void deleteById(Long id) {
        tutorPostService.delete(id);
    }

    @Override
    public List<DisplayTutorPostDto> findByTutorNameAndSubject(String tutorName, String subject) {
        return tutorPostService.findByTutorNameAndSubject(tutorName, subject).stream()
                .map(DisplayTutorPostDto::from)
                .collect(Collectors.toList());
    }
}
