package com.studentshub.service.application;

import com.studentshub.dto.create.CreateFavoriteDto;
import com.studentshub.dto.display.DisplayFavoriteDto;
import java.util.List;
import java.util.Optional;

public interface FavoriteApplicationService {
    List<DisplayFavoriteDto> findAll();
    Optional<DisplayFavoriteDto> findById(Long id);
    DisplayFavoriteDto save(CreateFavoriteDto dto);
    Optional<DisplayFavoriteDto> update(Long id, CreateFavoriteDto dto);
    Optional<DisplayFavoriteDto> deleteById(Long id);
    List<DisplayFavoriteDto> findByUserId(Long userId);
    void deleteAllByPostId(Long postId);
}

