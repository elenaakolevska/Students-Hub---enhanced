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
    List<Message> all = new ArrayList<>();
    if (u1.getSentMessages() != null) all.addAll(u1.getSentMessages());
    // If User has a list of received messages, add them as well. Otherwise, skip.
    // return all messages between u1 and u2
    return all.stream()
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
    sender.getSentMessages().add(msg);
    // If you have a receivedMessages list, add to it as well. Otherwise, skip.
    }

    @Override
    public List<User> getChatPartners(User user) {
        Set<User> partners = new HashSet<>();
        if (user.getSentMessages() != null) {
            for (Message msg : user.getSentMessages()) {
                if (msg.getReceiver() != null && !msg.getReceiver().equals(user)) partners.add(msg.getReceiver());
            }
        }
        // If you have a receivedMessages list, add similar logic here.
        return new ArrayList<>(partners);
    }

    @Override
    public Map<User, Long> getUnreadMessageCounts(User currentUser) {
        Map<User, Long> counts = new HashMap<>();
        if (currentUser.getSentMessages() != null) {
            for (Message msg : currentUser.getSentMessages()) {
                if (!msg.isRead() && msg.getReceiver().equals(currentUser)) {
                    counts.put(msg.getSender(), counts.getOrDefault(msg.getSender(), 0L) + 1);
                }
            }
        }
        // If you have a receivedMessages list, add similar logic here.
        return counts;
    }

    @Override
    public void markMessagesAsRead(User sender, User receiver) {
        if (receiver.getSentMessages() != null) {
            for (Message msg : receiver.getSentMessages()) {
                if (!msg.isRead() && msg.getSender().equals(sender)) {
                    msg.setRead(true);
                }
            }
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
