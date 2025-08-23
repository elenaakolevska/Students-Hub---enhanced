package com.studentshub.service;

import com.studentshub.model.Message;
import com.studentshub.model.User;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ChatService {
    List<Message> getChat(User u1, User u2);

    void send(User sender, User receiver, String content);

    List<User> getChatPartners(User user);
    Map<User, Long> getUnreadMessageCounts(User currentUser);
    void markMessagesAsRead(User sender, User receiver);
    Optional<LocalDateTime> getLastMessageTimestamp(User user1, User user2);


}
