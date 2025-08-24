package com.studentshub.service.application.impl;

import com.studentshub.dto.create.CreateMaterialPostDto;
import com.studentshub.dto.display.DisplayMaterialPostDto;
import com.studentshub.model.User;
import com.studentshub.service.application.MaterialPostApplicationService;
import com.studentshub.service.domain.MaterialPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MaterialPostApplicationServiceImpl implements MaterialPostApplicationService {
    private final MaterialPostService materialPostService;
    private final UserService userService;

    public MaterialPostApplicationServiceImpl(MaterialPostService materialPostService, UserService userService) {
        this.materialPostService = materialPostService;
        this.userService = userService;
    }

    @Override
    public Optional<DisplayMaterialPostDto> save(CreateMaterialPostDto createMaterialPostDto, String username) {
        User owner = userService.getUserByUsername(username);
        var materialPost = materialPostService.create(createMaterialPostDto.toMaterialPost(owner), username);
        return Optional.of(DisplayMaterialPostDto.from(materialPost));
    }

    @Override
    public Optional<DisplayMaterialPostDto> findById(Long id) {
        var materialPost = materialPostService.findById(id);
        return Optional.of(DisplayMaterialPostDto.from(materialPost));
    }

    @Override
    public List<DisplayMaterialPostDto> findAll() {
        return materialPostService.findAll().stream()
                .map(DisplayMaterialPostDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<DisplayMaterialPostDto> update(Long id, CreateMaterialPostDto createMaterialPostDto) {
        var existingPost = materialPostService.findById(id);
        if (existingPost != null) {
            var postToUpdate = createMaterialPostDto.toMaterialPost(existingPost.getOwner());
            var updatedPost = materialPostService.update(id, postToUpdate);
            return Optional.of(DisplayMaterialPostDto.from(updatedPost));
        }
        return Optional.empty();
    }

    @Override
    public void deleteById(Long id) {
        materialPostService.delete(id);
    }

    @Override
    public List<DisplayMaterialPostDto> findBySubject(String subject) {
        return materialPostService.findBySubject(subject).stream()
                .map(DisplayMaterialPostDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> findAllSubjects() {
        return materialPostService.findAllSubjects();
    }
}