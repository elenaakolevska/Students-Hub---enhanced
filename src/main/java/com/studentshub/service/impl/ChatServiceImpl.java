package com.studentshub.service.impl;

import com.studentshub.model.ChatMessage;
import com.studentshub.model.Message;
import com.studentshub.model.User;
import com.studentshub.repository.MessageRepository;
import com.studentshub.repository.UserRepository;
import com.studentshub.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChatServiceImpl implements ChatService {
    @Autowired
    private MessageRepository messageRepo;

    @Autowired
    private UserRepository userRepo;

    @Override
    public List<Message> getChat(User u1, User u2) {
        return messageRepo.findChatBetweenUsers(u1, u2);
    }

    @Override
    public void send(User sender, User receiver, String content) {

        Message msg = new Message();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent(content);
        msg.setTimestamp(LocalDateTime.now());
        messageRepo.save(msg);
    }

//    @Override
//    public List<User> getChatPartners(User user) {
//        return messageRepo.findChatPartners(user);
//    }
@Override
public List<User> getChatPartners(User user) {
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
        List<Message> unreadMessages = messageRepo.findChatBetweenUsers(sender, receiver)
                .stream()
                .filter(m -> !m.isRead() && m.getSender().equals(sender) && m.getReceiver().equals(receiver))
                .toList();
        for (Message msg : unreadMessages) {
            msg.setRead(true);
        }
        messageRepo.saveAll(unreadMessages);
    }

    @Override
    public Optional<LocalDateTime> getLastMessageTimestamp(User u1, User u2) {
        List<Message> chat = getChat(u1, u2);
        return chat.stream()
                .map(Message::getTimestamp)
                .max(LocalDateTime::compareTo);
    }

}
