package com.studentshub.service.domain.impl;

import com.studentshub.model.Message;
import com.studentshub.model.User;
import com.studentshub.service.domain.ChatService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    @Override
    public List<Message> getChat(User u1, User u2) {
        // Business logic: filter messages already loaded or passed from application layer
        return u1.getMessages().stream()
                .filter(m -> (m.getSender().equals(u1) && m.getReceiver().equals(u2)) ||
                        (m.getSender().equals(u2) && m.getReceiver().equals(u1)))
                .collect(Collectors.toList());
    }

    @Override
    public void sendMessage(User sender, User receiver, String content) {
        // Business logic only: create message entity
        if (content == null || content.isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }
        Message msg = new Message();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent(content);
        msg.setTimestamp(LocalDateTime.now());
        msg.setRead(false);

        // Note: saving to DB is handled by application layer
        sender.addSentMessage(msg);
        receiver.addReceivedMessage(msg);
    }

    @Override
    public List<User> getChatPartners(User user) {
        // Returns users from user’s chat history
        Set<User> partners = new HashSet<>();
        for (Message msg : user.getMessages()) {
            if (msg.getSender() != null && !msg.getSender().equals(user)) partners.add(msg.getSender());
            if (msg.getReceiver() != null && !msg.getReceiver().equals(user)) partners.add(msg.getReceiver());
        }
        return new ArrayList<>(partners);
    }

    @Override
    public Map<User, Long> getUnreadMessageCounts(User currentUser) {
        Map<User, Long> counts = new HashMap<>();
        for (Message msg : currentUser.getMessages()) {
            if (!msg.isRead() && msg.getReceiver().equals(currentUser)) {
                counts.put(msg.getSender(), counts.getOrDefault(msg.getSender(), 0L) + 1);
            }
        }
        return counts;
    }

    @Override
    public void markMessagesAsRead(User sender, User receiver) {
        List<Message> unreadMessages = receiver.getMessages().stream()
                .filter(m -> !m.isRead() && m.getSender().equals(sender))
                .collect(Collectors.toList());

        for (Message msg : unreadMessages) {
            msg.setRead(true);
        }
        // Persisting is done in the application layer
    }

    @Override
    public Optional<LocalDateTime> getLastMessageTimestamp(User u1, User u2) {
        return getChat(u1, u2).stream()
                .map(Message::getTimestamp)
                .max(LocalDateTime::compareTo);
    }
}
