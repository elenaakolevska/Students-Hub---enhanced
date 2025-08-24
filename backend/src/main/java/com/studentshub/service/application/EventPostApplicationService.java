package com.studentshub.service.application;

import com.studentshub.dto.create.CreateEventPostDto;
import com.studentshub.dto.display.DisplayEventPostDto;
import com.studentshub.model.enumerations.EventCategory;
import java.util.List;
import java.util.Optional;

public interface EventPostApplicationService {
    List<DisplayEventPostDto> findAll();
    List<DisplayEventPostDto> findByEventCategory(EventCategory category);
    Optional<DisplayEventPostDto> findById(Long id);
    Optional<DisplayEventPostDto> save(CreateEventPostDto createEventPostDto, String username);
    Optional<DisplayEventPostDto> update(Long id, CreateEventPostDto createEventPostDto);
    void deleteById(Long id);
}