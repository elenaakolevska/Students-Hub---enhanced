package com.studentshub.service.application;

import com.studentshub.dto.create.CreateGroupChatDto;
import com.studentshub.dto.display.DisplayGroupChatDto;
import com.studentshub.dto.display.DisplayMessageDto;

import java.util.List;
import java.util.Optional;

public interface GroupChatApplicationService {
    DisplayGroupChatDto createGroupChat(CreateGroupChatDto dto, String creatorUsername);
    List<DisplayGroupChatDto> getGroupChatsByUser(String username);
    Optional<DisplayGroupChatDto> getGroupChatById(Long id);
    List<DisplayMessageDto> getGroupMessages(Long groupId);
    DisplayMessageDto sendGroupMessage(Long groupId, String senderUsername, String content);
    void addUserToGroup(Long groupId, String username, boolean isAdmin);
    void removeUserFromGroup(Long groupId, String username);
    void deleteGroupChat(Long groupId);
    DisplayGroupChatDto updateGroupChat(Long groupId, String name, String description);
    boolean isUserMemberOfGroup(Long groupId, String username);
    boolean isUserAdminOfGroup(Long groupId, String username);
}
