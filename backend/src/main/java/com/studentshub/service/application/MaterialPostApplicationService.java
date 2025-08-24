package com.studentshub.service.application;

import com.studentshub.dto.create.CreateMaterialPostDto;
import com.studentshub.dto.display.DisplayMaterialPostDto;
import java.util.List;
import java.util.Optional;

public interface MaterialPostApplicationService {
    Optional<DisplayMaterialPostDto> save(CreateMaterialPostDto createMaterialPostDto, String username);
    Optional<DisplayMaterialPostDto> findById(Long id);
    List<DisplayMaterialPostDto> findAll();
    Optional<DisplayMaterialPostDto> update(Long id, CreateMaterialPostDto createMaterialPostDto);
    void deleteById(Long id);
    List<DisplayMaterialPostDto> findBySubject(String subject);
    List<String> findAllSubjects();
}