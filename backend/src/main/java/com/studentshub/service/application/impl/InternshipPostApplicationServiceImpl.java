package com.studentshub.service.application.impl;

import com.studentshub.dto.create.CreateInternshipPostDto;
import com.studentshub.dto.display.DisplayInternshipPostDto;
import com.studentshub.model.User;
import com.studentshub.service.application.InternshipPostApplicationService;
import com.studentshub.service.domain.InternshipPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InternshipPostApplicationServiceImpl implements InternshipPostApplicationService {
    private final InternshipPostService internshipPostService;
    private final UserService userService;

    public InternshipPostApplicationServiceImpl(InternshipPostService internshipPostService, UserService userService) {
        this.internshipPostService = internshipPostService;
        this.userService = userService;
    }

    @Override
    public Optional<DisplayInternshipPostDto> save(CreateInternshipPostDto createInternshipPostDto, String username) {
        User owner = userService.getUserByUsername(username);
        var internshipPost = internshipPostService.create(createInternshipPostDto.toInternshipPost(owner), username);
        return Optional.of(DisplayInternshipPostDto.from(internshipPost));
    }

    @Override
    public Optional<DisplayInternshipPostDto> findById(Long id) {
        var internshipPost = internshipPostService.findById(id);
        return Optional.of(DisplayInternshipPostDto.from(internshipPost));
    }

    @Override
    public List<DisplayInternshipPostDto> findAll() {
        return internshipPostService.findAll().stream()
                .map(DisplayInternshipPostDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<DisplayInternshipPostDto> update(Long id, CreateInternshipPostDto createInternshipPostDto) {
        var existingPost = internshipPostService.findById(id);
        if (existingPost != null) {
            var postToUpdate = createInternshipPostDto.toInternshipPost(existingPost.getOwner());
            var updatedPost = internshipPostService.update(id, postToUpdate);
            return Optional.of(DisplayInternshipPostDto.from(updatedPost));
        }
        return Optional.empty();
    }

    @Override
    public void deleteById(Long id) {
        internshipPostService.delete(id);
    }

    @Override
    public List<DisplayInternshipPostDto> findByFacultyFilter(String facultyFilter) {
        return internshipPostService.findByFacultyFilter(facultyFilter).stream()
                .map(DisplayInternshipPostDto::from)
                .collect(Collectors.toList());
    }
}