package com.studentshub.service;

import com.studentshub.model.Tag;
import java.util.List;

public interface TagService {
    Tag createTag(Tag tag);
    Tag getTagById(Long id);
    Tag getTagByName(String name);
    List<Tag> getAllTags();
    void deleteTag(Long id);
}
