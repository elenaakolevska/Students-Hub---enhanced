package com.studentshub.service.application;

import com.studentshub.dto.create.CreateTutorPostDto;
import com.studentshub.dto.display.DisplayTutorPostDto;
import java.util.List;
import java.util.Optional;

public interface TutorPostApplicationService {
    Optional<DisplayTutorPostDto> save(CreateTutorPostDto createTutorPostDto, String username);
    Optional<DisplayTutorPostDto> findById(Long id);
    List<DisplayTutorPostDto> findAll();
    Optional<DisplayTutorPostDto> update(Long id, CreateTutorPostDto createTutorPostDto);
    void deleteById(Long id);
    List<DisplayTutorPostDto> findByTutorNameAndSubject(String tutorName, String subject);
}