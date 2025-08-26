package com.studentshub.dto.display;

import com.studentshub.model.Tag;
import com.studentshub.model.enumerations.PostCategory;
import java.util.List;
import java.util.stream.Collectors;

public record DisplayTagDto(Long id, String name, PostCategory postCategory) {
    public static DisplayTagDto from(Tag tag) {
        return new DisplayTagDto(
                tag.getId(),
                tag.getName(),
                tag.getPostCategory()
        );
    }
    public static List<DisplayTagDto> from(List<Tag> tags) {
        return tags.stream().map(DisplayTagDto::from).collect(Collectors.toList());
    }
}