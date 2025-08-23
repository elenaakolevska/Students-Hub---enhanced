package com.studentshub.service.impl;

import com.studentshub.model.GroupChat;
import com.studentshub.model.Message;
import com.studentshub.model.User;
import com.studentshub.repository.MessageRepository;
import com.studentshub.service.MessageService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;

    public MessageServiceImpl(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public Message sendMessage(User sender, User receiver, GroupChat group, String content) {
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setGroup(group);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }

    @Override
    public List<Message> getMessagesBetweenUsers(User user1, User user2) {
        return messageRepository.findBySenderOrReceiver(user1, user2);
    }

    @Override
    public List<Message> getMessagesInGroup(GroupChat group) {
        return messageRepository.findByGroup(group);
    }
}
