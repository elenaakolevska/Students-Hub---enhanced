package com.studentshub.service.impl;

import com.studentshub.model.GroupChat;
import com.studentshub.model.GroupChatMembers;
import com.studentshub.model.User;
import com.studentshub.model.exceptions.PostNotFoundException;
import com.studentshub.repository.GroupChatMembersRepository;
import com.studentshub.repository.GroupChatRepository;
import com.studentshub.service.GroupChatService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupChatServiceImpl implements GroupChatService {

    private final GroupChatRepository groupChatRepository;
    private final GroupChatMembersRepository groupChatMembersRepository;

    public GroupChatServiceImpl(GroupChatRepository groupChatRepository,
                                GroupChatMembersRepository groupChatMembersRepository) {
        this.groupChatRepository = groupChatRepository;
        this.groupChatMembersRepository = groupChatMembersRepository;
    }

    @Override
    public GroupChat getGroupChatById(Long id) {
        return groupChatRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(id));
    }

    @Override
    public GroupChat createGroupChat(String name, User creator) {
        GroupChat group = new GroupChat();
        group.setName(name);
        group.setCreatedBy(creator);
        return groupChatRepository.save(group);
    }

    @Override
    public void addUserToGroup(GroupChat group, User user) {
        GroupChatMembers member = new GroupChatMembers();
        member.setGroup(group);
        member.setUser(user);
        groupChatMembersRepository.save(member);
    }

    @Override
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
    public List<GroupChat> getGroupsByUser(User user) {
        return groupChatMembersRepository.findByUser(user)
                .stream()
                .map(GroupChatMembers::getGroup)
                .collect(Collectors.toList());
    }
}

