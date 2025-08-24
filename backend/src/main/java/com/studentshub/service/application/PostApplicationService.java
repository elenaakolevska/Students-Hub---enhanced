package com.studentshub.service.application;

import com.studentshub.dto.create.CreatePostDto;
import com.studentshub.dto.display.DisplayPostDto;
import com.studentshub.model.enumerations.PostCategory;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface PostApplicationService {
    List<DisplayPostDto> findAll();
    Optional<DisplayPostDto> findById(Long id);
    List<DisplayPostDto> findByOwnerUsername(String username);
    Optional<DisplayPostDto> save(CreatePostDto createPostDto, String username);
    Optional<DisplayPostDto> update(Long id, CreatePostDto createPostDto);
    void deleteById(Long id);
    Map<PostCategory, DisplayPostDto> getLatestPostPerCategory();
    List<DisplayPostDto> findByUsername(String username);
    List<DisplayPostDto> getLatestThreePosts();
}