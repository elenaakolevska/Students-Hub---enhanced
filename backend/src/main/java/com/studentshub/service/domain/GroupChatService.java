package com.studentshub.service.domain;

import com.studentshub.model.GroupChat;
import com.studentshub.model.Message;
import com.studentshub.model.User;

import java.util.List;
import java.util.Optional;

public interface GroupChatService {
    GroupChat createGroupChat(String name, String description, User creator, List<User> initialMembers);
    Optional<GroupChat> getGroupChatById(Long id);
    List<GroupChat> getGroupChatsByUser(User user);
    void addUserToGroup(GroupChat group, User user, boolean isAdmin);
    void removeUserFromGroup(GroupChat group, User user);
    List<Message> getGroupMessages(GroupChat group);
    Message sendGroupMessage(User sender, GroupChat group, String content);
    void deleteGroupChat(GroupChat group);
    GroupChat updateGroupChat(GroupChat group, String name, String description);
    List<User> getGroupMembers(GroupChat group);
    boolean isUserMemberOfGroup(GroupChat group, User user);
    boolean isUserAdminOfGroup(GroupChat group, User user);
}
