package com.studentshub.service.domain.impl;

import com.studentshub.model.GroupChat;
import com.studentshub.model.GroupChatMembers;
import com.studentshub.model.Message;
import com.studentshub.model.User;
import com.studentshub.repository.GroupChatMembersRepository;
import com.studentshub.repository.GroupChatRepository;
import com.studentshub.repository.MessageRepository;
import com.studentshub.service.domain.GroupChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GroupChatServiceImpl implements GroupChatService {

    @Autowired
    private GroupChatRepository groupChatRepository;
    
    @Autowired
    private GroupChatMembersRepository groupChatMembersRepository;
    
    @Autowired
    private MessageRepository messageRepository;

    @Override
    @Transactional
    public GroupChat createGroupChat(String name, String description, User creator, List<User> initialMembers) {
        GroupChat groupChat = new GroupChat();
        groupChat.setName(name);
        groupChat.setDescription(description);
        groupChat.setCreatedBy(creator);
        groupChat.setCreatedAt(LocalDateTime.now());
        
        GroupChat savedGroupChat = groupChatRepository.save(groupChat);
        
        // Add creator as admin
        addUserToGroup(savedGroupChat, creator, true);
        
        // Add other members
        for (User member : initialMembers) {
            if (!member.equals(creator)) {
                addUserToGroup(savedGroupChat, member, false);
            }
        }
        
        return savedGroupChat;
    }

    @Override
    public Optional<GroupChat> getGroupChatById(Long id) {
        return groupChatRepository.findById(id);
    }

    @Override
    public List<GroupChat> getGroupChatsByUser(User user) {
        List<GroupChatMembers> memberships = groupChatMembersRepository.findByUser(user);
        return memberships.stream()
                .map(GroupChatMembers::getGroup)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void addUserToGroup(GroupChat group, User user, boolean isAdmin) {
        // Check if user is already a member
        boolean isAlreadyMember = group.getMembers().stream()
                .anyMatch(member -> member.getUser().equals(user));
        
        if (!isAlreadyMember) {
            GroupChatMembers member = new GroupChatMembers();
            member.setGroup(group);
            member.setUser(user);
            member.setJoinedAt(LocalDateTime.now());
            member.setAdmin(isAdmin);
            
            groupChatMembersRepository.save(member);
        }
    }

    @Override
    @Transactional
    public void removeUserFromGroup(GroupChat group, User user) {
        List<GroupChatMembers> memberships = groupChatMembersRepository.findByUser(user);
        for (GroupChatMembers member : memberships) {
            if (member.getGroup().equals(group)) {
                groupChatMembersRepository.delete(member);
                break;
            }
        }
    }

    @Override
    public List<Message> getGroupMessages(GroupChat group) {
        return messageRepository.findByGroupOrderByTimestampAsc(group);
    }

    @Override
    @Transactional
    public Message sendGroupMessage(User sender, GroupChat group, String content) {
        Message message = new Message();
        message.setSender(sender);
        message.setGroup(group);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        
        return messageRepository.save(message);
    }

    @Override
    @Transactional
    public void deleteGroupChat(GroupChat group) {
        groupChatRepository.delete(group);
    }

    @Override
    @Transactional
    public GroupChat updateGroupChat(GroupChat group, String name, String description) {
        group.setName(name);
        group.setDescription(description);
        return groupChatRepository.save(group);
    }

    @Override
    public List<User> getGroupMembers(GroupChat group) {
        return group.getMembers().stream()
                .map(GroupChatMembers::getUser)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isUserMemberOfGroup(GroupChat group, User user) {
        return group.getMembers().stream()
                .anyMatch(member -> member.getUser().equals(user));
    }

    @Override
    public boolean isUserAdminOfGroup(GroupChat group, User user) {
        return group.getMembers().stream()
                .anyMatch(member -> member.getUser().equals(user) && member.isAdmin());
    }
}
