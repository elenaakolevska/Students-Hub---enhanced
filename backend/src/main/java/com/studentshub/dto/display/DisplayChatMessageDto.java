package com.studentshub.dto.display;

import com.studentshub.model.ChatMessage;

public record DisplayChatMessageDto(
        String sender,
        String receiver,
        String content
) {
    public static DisplayChatMessageDto fromChatMessage(ChatMessage msg) {
        return new DisplayChatMessageDto(
                msg.getSender(),
                msg.getReceiver(),
                msg.getContent()
        );
    }
}
