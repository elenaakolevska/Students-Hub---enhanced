package com.studentshub.service.application;

import com.studentshub.dto.create.CreateTagDto;
import com.studentshub.dto.display.DisplayTagDto;
import java.util.List;
import java.util.Optional;

public interface TagApplicationService {
    List<DisplayTagDto> findAll();
    Optional<DisplayTagDto> findById(Long id);
    DisplayTagDto save(CreateTagDto dto);
    Optional<DisplayTagDto> update(Long id, CreateTagDto dto);
    Optional<DisplayTagDto> deleteById(Long id);
    Optional<DisplayTagDto> findByName(String name);
}
