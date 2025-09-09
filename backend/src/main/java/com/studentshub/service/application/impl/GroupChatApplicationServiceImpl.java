package com.studentshub.service.application.impl;

import com.studentshub.dto.create.CreateGroupChatDto;
import com.studentshub.dto.display.DisplayGroupChatDto;
import com.studentshub.dto.display.DisplayMessageDto;
import com.studentshub.model.GroupChat;
import com.studentshub.model.Message;
import com.studentshub.model.User;
import com.studentshub.repository.UserRepository;
import com.studentshub.service.application.GroupChatApplicationService;
import com.studentshub.service.domain.GroupChatService;
import com.studentshub.service.domain.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GroupChatApplicationServiceImpl implements GroupChatApplicationService {

    @Autowired
    private GroupChatService groupChatService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public DisplayGroupChatDto createGroupChat(CreateGroupChatDto dto, String creatorUsername) {
        User creator = userService.getUserByUsername(creatorUsername);
        List<User> members = new ArrayList<>();
        
        // Safely handle null memberIds
        if (dto.memberIds() != null) {
            members = dto.memberIds().stream()
                    .map(userService::getUserById)
                    .collect(Collectors.toList());
        }
        
        GroupChat groupChat = groupChatService.createGroupChat(
                dto.name(),
                dto.description(),
                creator,
                members
        );
        
        return DisplayGroupChatDto.from(groupChat);
    }

    @Override
    public List<DisplayGroupChatDto> getGroupChatsByUser(String username) {
        User user = userService.getUserByUsername(username);
        return groupChatService.getGroupChatsByUser(user).stream()
                .map(DisplayGroupChatDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<DisplayGroupChatDto> getGroupChatById(Long id) {
        return groupChatService.getGroupChatById(id)
                .map(DisplayGroupChatDto::from);
    }

    @Override
    public List<DisplayMessageDto> getGroupMessages(Long groupId) {
        Optional<GroupChat> groupChatOpt = groupChatService.getGroupChatById(groupId);
        if (groupChatOpt.isEmpty()) {
            throw new NoSuchElementException("Group chat not found with id: " + groupId);
        }
        
        GroupChat groupChat = groupChatOpt.get();
        List<Message> messages = groupChatService.getGroupMessages(groupChat);
        
        return messages.stream()
                .map(DisplayMessageDto::fromMessage)
                .collect(Collectors.toList());
    }

    @Override
    public DisplayMessageDto sendGroupMessage(Long groupId, String senderUsername, String content) {
        GroupChat groupChat = groupChatService.getGroupChatById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group chat not found with id: " + groupId));
        
        User sender = userService.getUserByUsername(senderUsername);
        
        if (!groupChatService.isUserMemberOfGroup(groupChat, sender)) {
            throw new IllegalStateException("User is not a member of this group chat");
        }
        
        Message message = groupChatService.sendGroupMessage(sender, groupChat, content);
        return DisplayMessageDto.fromMessage(message);
    }

    @Override
    public void addUserToGroup(Long groupId, String username, boolean isAdmin) {
        GroupChat groupChat = groupChatService.getGroupChatById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group chat not found with id: " + groupId));
        
        User user = userService.getUserByUsername(username);
        groupChatService.addUserToGroup(groupChat, user, isAdmin);
    }

    @Override
    public void removeUserFromGroup(Long groupId, String username) {
        GroupChat groupChat = groupChatService.getGroupChatById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group chat not found with id: " + groupId));
        
        User user = userService.getUserByUsername(username);
        groupChatService.removeUserFromGroup(groupChat, user);
    }

    @Override
    public void deleteGroupChat(Long groupId) {
        GroupChat groupChat = groupChatService.getGroupChatById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group chat not found with id: " + groupId));
        
        groupChatService.deleteGroupChat(groupChat);
    }

    @Override
    public DisplayGroupChatDto updateGroupChat(Long groupId, String name, String description) {
        GroupChat groupChat = groupChatService.getGroupChatById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group chat not found with id: " + groupId));
        
        GroupChat updatedGroupChat = groupChatService.updateGroupChat(groupChat, name, description);
        return DisplayGroupChatDto.from(updatedGroupChat);
    }

    @Override
    public boolean isUserMemberOfGroup(Long groupId, String username) {
        GroupChat groupChat = groupChatService.getGroupChatById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group chat not found with id: " + groupId));
        
        User user = userService.getUserByUsername(username);
        return groupChatService.isUserMemberOfGroup(groupChat, user);
    }

    @Override
    public boolean isUserAdminOfGroup(Long groupId, String username) {
        GroupChat groupChat = groupChatService.getGroupChatById(groupId)
                .orElseThrow(() -> new NoSuchElementException("Group chat not found with id: " + groupId));
        
        User user = userService.getUserByUsername(username);
        return groupChatService.isUserAdminOfGroup(groupChat, user);
    }
}
