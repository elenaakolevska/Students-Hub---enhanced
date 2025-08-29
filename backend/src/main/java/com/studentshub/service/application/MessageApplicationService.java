package com.studentshub.service.application;

import com.studentshub.dto.display.DisplayMessageDto;
import com.studentshub.dto.display.DisplayUserDto;
import com.studentshub.model.GroupChat;
import java.util.List;

public interface MessageApplicationService {
    DisplayMessageDto sendMessage(DisplayUserDto sender, DisplayUserDto receiver, GroupChat group, String content);
    List<DisplayMessageDto> getMessagesBetweenUsers(DisplayUserDto user1, DisplayUserDto user2);
    List<DisplayMessageDto> getMessagesInGroup(GroupChat group);
}

