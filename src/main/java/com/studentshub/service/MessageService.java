package com.studentshub.service;

import com.studentshub.model.GroupChat;
import com.studentshub.model.Message;
import com.studentshub.model.User;

import java.util.List;

public interface MessageService {
    Message sendMessage(User sender, User receiver, GroupChat group, String content);
    List<Message> getMessagesBetweenUsers(User user1, User user2);
    List<Message> getMessagesInGroup(GroupChat group);
}

