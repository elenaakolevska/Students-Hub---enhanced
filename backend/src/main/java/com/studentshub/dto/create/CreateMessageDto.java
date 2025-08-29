package com.studentshub.dto.create;

import com.studentshub.model.GroupChat;
import com.studentshub.model.Message;
import com.studentshub.model.User;

import java.time.LocalDateTime;

public record CreateMessageDto(
        Long senderId,
        Long receiverId,
        Long groupId,
        String content
) {
    public Message toMessage(User sender, User receiver, GroupChat group) {
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setGroup(group);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now()); // set by server
        message.setRead(false); // default
        return message;
    }
}