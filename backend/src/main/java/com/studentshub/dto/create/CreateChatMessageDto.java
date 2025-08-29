package com.studentshub.dto.create;

import com.studentshub.model.ChatMessage;

public record CreateChatMessageDto(
        String sender,
        String receiver,
        String content
) {
    public ChatMessage toChatMessage() {
        ChatMessage msg = new ChatMessage();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent(content);
        return msg;
    }
}