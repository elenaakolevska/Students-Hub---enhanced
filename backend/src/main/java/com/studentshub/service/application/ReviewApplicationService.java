package com.studentshub.service.application;

import com.studentshub.dto.create.CreateReviewDto;
import com.studentshub.dto.display.DisplayReviewDto;
import java.util.List;
import java.util.Optional;

public interface ReviewApplicationService {
    List<DisplayReviewDto> findAll();
    Optional<DisplayReviewDto> findById(Long id);
    DisplayReviewDto save(CreateReviewDto dto);
    Optional<DisplayReviewDto> update(Long id, CreateReviewDto dto);
    Optional<DisplayReviewDto> deleteById(Long id);
    List<DisplayReviewDto> findByPostId(Long postId);
}
