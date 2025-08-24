package com.studentshub.service.application;

import com.studentshub.dto.create.CreateInternshipPostDto;
import com.studentshub.dto.display.DisplayInternshipPostDto;
import java.util.List;
import java.util.Optional;

public interface InternshipPostApplicationService {
    Optional<DisplayInternshipPostDto> save(CreateInternshipPostDto createInternshipPostDto, String username);
    Optional<DisplayInternshipPostDto> findById(Long id);
    List<DisplayInternshipPostDto> findAll();
    Optional<DisplayInternshipPostDto> update(Long id, CreateInternshipPostDto createInternshipPostDto);
    void deleteById(Long id);
    List<DisplayInternshipPostDto> findByFacultyFilter(String facultyFilter);
}