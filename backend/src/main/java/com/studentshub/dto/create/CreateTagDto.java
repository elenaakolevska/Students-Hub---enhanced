package com.studentshub.dto.create;

import com.studentshub.model.Tag;
import com.studentshub.model.enumerations.PostCategory;

public record CreateTagDto(String name, PostCategory postCategory) {
    public Tag toTag() {
        return new Tag(null, name, postCategory);
    }
}

