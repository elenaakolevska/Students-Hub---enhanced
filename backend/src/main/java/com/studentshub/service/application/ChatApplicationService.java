package com.studentshub.service.application;

import com.studentshub.dto.display.DisplayMessageDto;
import com.studentshub.dto.display.DisplayUserDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ChatApplicationService {

    List<DisplayMessageDto> getChat(DisplayUserDto u1, DisplayUserDto u2);


    void sendMessage(DisplayUserDto sender, DisplayUserDto receiver, String content);


    List<DisplayUserDto> getChatPartners(DisplayUserDto user);


    Map<DisplayUserDto, Long> getUnreadMessageCounts(DisplayUserDto currentUser);


    void markMessagesAsRead(DisplayUserDto sender, DisplayUserDto receiver);

    Optional<LocalDateTime> getLastMessageTimestamp(DisplayUserDto user1, DisplayUserDto user2);
}
