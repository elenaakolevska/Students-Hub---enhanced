package com.studentshub.service.application.impl;

import com.studentshub.dto.display.DisplayMessageDto;
import com.studentshub.dto.display.DisplayUserDto;
import com.studentshub.model.GroupChat;
import com.studentshub.model.Message;
import com.studentshub.model.User;
import com.studentshub.repository.UserRepository;
import com.studentshub.service.application.MessageApplicationService;
import com.studentshub.service.domain.MessageService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageApplicationServiceImpl implements MessageApplicationService {
    private final MessageService messageService;
    private final UserRepository userRepository;

    public MessageApplicationServiceImpl(MessageService messageService, UserRepository userRepository) {
        this.messageService = messageService;
        this.userRepository = userRepository;
    }

    @Override
    public DisplayMessageDto sendMessage(DisplayUserDto sender, DisplayUserDto receiver, GroupChat group, String content) {
        User senderEntity = userRepository.findById(sender.id()).orElseThrow();
        User receiverEntity = receiver != null ? userRepository.findById(receiver.id()).orElse(null) : null;
        Message message = messageService.sendMessage(senderEntity, receiverEntity, group, content);
        return DisplayMessageDto.fromMessage(message);
    }

    @Override
    public List<DisplayMessageDto> getMessagesBetweenUsers(DisplayUserDto user1, DisplayUserDto user2) {
        User user1Entity = userRepository.findById(user1.id()).orElseThrow();
        User user2Entity = userRepository.findById(user2.id()).orElseThrow();
        return messageService.getMessagesBetweenUsers(user1Entity, user2Entity)
                .stream()
                .map(DisplayMessageDto::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    public List<DisplayMessageDto> getMessagesInGroup(GroupChat group) {
        return messageService.getMessagesInGroup(group)
                .stream()
                .map(DisplayMessageDto::fromMessage)
                .collect(Collectors.toList());
    }
}

