package com.studentshub.service.application.impl;

import com.studentshub.dto.display.DisplayMessageDto;
import com.studentshub.dto.display.DisplayUserDto;
import com.studentshub.model.Message;
import com.studentshub.model.User;
import com.studentshub.repository.MessageRepository;
import com.studentshub.repository.UserRepository;
import com.studentshub.service.application.ChatApplicationService;
import com.studentshub.service.domain.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatApplicationServiceImpl implements ChatApplicationService {
    private final MessageRepository messageRepo;
    private final UserRepository userRepo;
    @Autowired
    private ChatService chatDomainService;

    public ChatApplicationServiceImpl(MessageRepository messageRepo,
                                      UserRepository userRepo) {
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
    }

    @Override
    public List<DisplayMessageDto> getChat(DisplayUserDto u1, DisplayUserDto u2) {
        User user1 = userRepo.findById(u1.id()).orElseThrow();
        User user2 = userRepo.findById(u2.id()).orElseThrow();
        List<Message> messages = messageRepo.findChatBetweenUsers(user1, user2);
        return messages.stream().map(DisplayMessageDto::fromMessage).collect(Collectors.toList());
    }

    @Override
    public void sendMessage(DisplayUserDto sender, DisplayUserDto receiver, String content) {
        User senderEntity = userRepo.findById(sender.id()).orElseThrow();
        User receiverEntity = userRepo.findById(receiver.id()).orElseThrow();
        chatDomainService.send(senderEntity, receiverEntity, content);
    }

    @Override
    public List<DisplayUserDto> getChatPartners(DisplayUserDto user) {
        User userEntity = userRepo.findById(user.id()).orElseThrow();
        List<User> allUsers = userRepo.findAll();
        allUsers.removeIf(u -> u.getId().equals(userEntity.getId()));
        return DisplayUserDto.from(allUsers);
    }

    @Override
    public Map<DisplayUserDto, Long> getUnreadMessageCounts(DisplayUserDto currentUser) {
        User currentUserEntity = userRepo.findById(currentUser.id()).orElseThrow();
        List<User> chatPartners = userRepo.findAll();
        chatPartners.removeIf(u -> u.getId().equals(currentUserEntity.getId()));
        Map<DisplayUserDto, Long> unreadCounts = new HashMap<>();
        for (User partner : chatPartners) {
            long count = messageRepo.countUnreadMessages(partner, currentUserEntity);
            unreadCounts.put(DisplayUserDto.from(partner), count);
        }
        return unreadCounts;
    }

    @Override
    public void markMessagesAsRead(DisplayUserDto sender, DisplayUserDto receiver) {
        User senderEntity = userRepo.findById(sender.id()).orElseThrow();
        User receiverEntity = userRepo.findById(receiver.id()).orElseThrow();
        chatDomainService.markMessagesAsRead(senderEntity, receiverEntity);
        List<Message> updated = messageRepo.findChatBetweenUsers(senderEntity, receiverEntity);
        messageRepo.saveAll(updated);
    }

    @Override
    public Optional<LocalDateTime> getLastMessageTimestamp(DisplayUserDto u1, DisplayUserDto u2) {
        User user1 = userRepo.findById(u1.id()).orElseThrow();
        User user2 = userRepo.findById(u2.id()).orElseThrow();
        return messageRepo.findChatBetweenUsers(user1, user2).stream()
                .map(Message::getTimestamp)
                .max(LocalDateTime::compareTo);
    }
}
