package com.studentshub.service;

import com.studentshub.model.GroupChat;
import com.studentshub.model.User;

import java.util.List;

public interface GroupChatService {
    GroupChat getGroupChatById(Long id);
    GroupChat createGroupChat(String name, User creator);
    void addUserToGroup(GroupChat group, User user);
    void removeUserFromGroup(GroupChat group, User user);
    List<GroupChat> getGroupsByUser(User user);
}

