package com.studentshub.dto.display;

import com.studentshub.model.Message;

import java.time.LocalDateTime;

public record DisplayMessageDto(
        Long id,
        String senderUsername,
        String receiverUsername,
        String groupName,
        String content,
        LocalDateTime timestamp,
        boolean read
) {
    public static DisplayMessageDto fromMessage(Message message) {
        return new DisplayMessageDto(
                message.getId(),
                message.getSender() != null ? message.getSender().getUsername() : null,
                message.getReceiver() != null ? message.getReceiver().getUsername() : null,
                message.getGroup() != null ? message.getGroup().getName() : null,
                message.getContent(),
                message.getTimestamp(),
                message.isRead()
        );
    }
}