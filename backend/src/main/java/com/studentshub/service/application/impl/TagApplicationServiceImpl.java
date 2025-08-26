package com.studentshub.service.application.impl;

import com.studentshub.dto.create.CreateTagDto;
import com.studentshub.dto.display.DisplayTagDto;
import com.studentshub.model.Tag;
import com.studentshub.service.domain.TagService;
import com.studentshub.service.application.TagApplicationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TagApplicationServiceImpl implements TagApplicationService {

    private final TagService tagService;

    public TagApplicationServiceImpl(TagService tagService) {
        this.tagService = tagService;
    }

    @Override
    public List<DisplayTagDto> findAll() {
        return tagService.getAllTags().stream()
                .map(DisplayTagDto::from)
                .toList();
    }

    @Override
    public Optional<DisplayTagDto> findById(Long id) {
        try {
            Tag tag = tagService.getTagById(id);
            return Optional.of(DisplayTagDto.from(tag));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public DisplayTagDto save(CreateTagDto dto) {
        Tag tag = new Tag(null, dto.name(), dto.postCategory());
        Tag saved = tagService.createTag(tag);
        return DisplayTagDto.from(saved);
    }

    @Override
    public Optional<DisplayTagDto> update(Long id, CreateTagDto dto) {
        try {
            Tag existing = tagService.getTagById(id);
            existing.setName(dto.name());
            existing.setPostCategory(dto.postCategory());
            Tag updated = tagService.createTag(existing);
            return Optional.of(DisplayTagDto.from(updated));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<DisplayTagDto> deleteById(Long id) {
        try {
            Tag tag = tagService.getTagById(id);
            tagService.deleteTag(id);
            return Optional.of(DisplayTagDto.from(tag));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<DisplayTagDto> findByName(String name) {
        try {
            Tag tag = tagService.getTagByName(name);
            return Optional.of(DisplayTagDto.from(tag));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}