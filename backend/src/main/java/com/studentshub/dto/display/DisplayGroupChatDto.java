package com.studentshub.dto.display;

import com.studentshub.model.GroupChat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record DisplayGroupChatDto(
        Long id,
        String name,
        String description,
        DisplayUserDto createdBy,
        LocalDateTime createdAt,
        List<DisplayUserDto> members
) {
    public static DisplayGroupChatDto from(GroupChat groupChat) {
        List<DisplayUserDto> members = groupChat.getMembers()
                .stream()
                .map(member -> DisplayUserDto.from(member.getUser()))
                .collect(Collectors.toList());
        
        return new DisplayGroupChatDto(
                groupChat.getId(),
                groupChat.getName(),
                groupChat.getDescription(),
                DisplayUserDto.from(groupChat.getCreatedBy()),
                groupChat.getCreatedAt(),
                members
        );
    }
}
