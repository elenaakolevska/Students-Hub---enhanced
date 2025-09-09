package com.studentshub.dto.create;

import java.util.List;

public record CreateGroupChatDto(
        String name,
        String description,
        List<Long> memberIds
) {
}
