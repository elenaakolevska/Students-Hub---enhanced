package com.studentshub.service.application.impl;

import com.studentshub.model.Message;
import com.studentshub.model.User;
import com.studentshub.repository.MessageRepository;
import com.studentshub.repository.UserRepository;
import com.studentshub.service.application.ChatApplicationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ChatApplicationServiceImpl implements ChatApplicationService {
    private final MessageRepository messageRepo;
    private final UserRepository userRepo;
    private final ChatService chatDomainService;

    public ChatApplicationServiceImpl(MessageRepository messageRepo,
                                      UserRepository userRepo,
                                      ChatService chatDomainService) {
        this.messageRepo = messageRepo;
        this.userRepo = userRepo;
        this.chatDomainService = chatDomainService;
    }

    @Override
    public List<Message> getChat(User u1, User u2) {
        // Persistence query from repository
        return messageRepo.findChatBetweenUsers(u1, u2);
    }

    @Override
    public void sendMessage(User sender, User receiver, String content) {
        // Let domain handle business rules + enrich entity
        chatDomainService.sendMessage(sender, receiver, content);

        // Persist entity changes (messages are already created in domain)
        // Depending on your model, you might need to extract the latest message and save
        messageRepo.saveAll(sender.getSentMessages());
//        messageRepo.saveAll(receiver.getReceivedMessages());
    }

    @Override
    public List<User> getChatPartners(User user) {
        // Could also query repository directly for performance
        List<User> allUsers = userRepo.findAll();
        allUsers.removeIf(u -> u.getId().equals(user.getId()));
        return allUsers;
    }

    @Override
    public Map<User, Long> getUnreadMessageCounts(User currentUser) {
        List<User> chatPartners = getChatPartners(currentUser);
        Map<User, Long> unreadCounts = new HashMap<>();
        for (User partner : chatPartners) {
            long count = messageRepo.countUnreadMessages(partner, currentUser);
            unreadCounts.put(partner, count);
        }
        return unreadCounts;
    }

    @Override
    public void markMessagesAsRead(User sender, User receiver) {
        // Delegate to domain service to mark in memory
        chatDomainService.markMessagesAsRead(sender, receiver);

        // Persist updated messages
        List<Message> updated = messageRepo.findChatBetweenUsers(sender, receiver);
        messageRepo.saveAll(updated);
    }

    @Override
    public Optional<LocalDateTime> getLastMessageTimestamp(User u1, User u2) {
        return getChat(u1, u2).stream()
                .map(Message::getTimestamp)
                .max(LocalDateTime::compareTo);
    }
}
