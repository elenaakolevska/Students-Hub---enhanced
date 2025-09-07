package com.studentshub.web;

import com.studentshub.dto.display.DisplayMessageDto;
import com.studentshub.dto.display.DisplayUserDto;
import com.studentshub.model.User;
import com.studentshub.repository.UserRepository;
import com.studentshub.service.application.ChatApplicationService;
import com.studentshub.service.domain.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatApplicationService chatService;
    private final UserRepository userRepo;
    private final UserService userService;

    @GetMapping("/partners")
    public List<Map<String, Object>> getChatPartners(Principal principal) {
        User currentUser = getCurrentUser(principal);
        DisplayUserDto currentUserDto = DisplayUserDto.from(currentUser);
        List<DisplayUserDto> partners = chatService.getChatPartners(currentUserDto);

        partners.sort((u1, u2) -> {
            LocalDateTime t1 = chatService.getLastMessageTimestamp(currentUserDto, u1).orElse(LocalDateTime.MIN);
            LocalDateTime t2 = chatService.getLastMessageTimestamp(currentUserDto, u2).orElse(LocalDateTime.MIN);
            return t2.compareTo(t1);
        });

        Map<DisplayUserDto, Long> unreadCounts = chatService.getUnreadMessageCounts(currentUserDto);

        return partners.stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.id(),
                        "username", u.username(),
                        "unreadCount", unreadCounts.getOrDefault(u, 0L)
                ))
                .collect(Collectors.toList());

    }

    @GetMapping("/messages/{username}")
    public Map<String, Object> getChatWith(@PathVariable String username, Principal principal) {
        User currentUser = getCurrentUser(principal);
        DisplayUserDto currentUserDto = DisplayUserDto.from(currentUser);

        Optional<User> optionalOther = userRepo.findByUsername(username);
        if (optionalOther.isEmpty()) {
            throw new NoSuchElementException("User not found: " + username);
        }
        User other = optionalOther.get();
        DisplayUserDto otherDto = DisplayUserDto.from(other);

        chatService.markMessagesAsRead(otherDto, currentUserDto);

        List<DisplayMessageDto> messages = chatService.getChat(currentUserDto, otherDto);

        return Map.of(
                "currentUser", Map.of("id", currentUser.getId(), "username", currentUser.getUsername()),
                "receiver", Map.of("id", other.getId(), "username", other.getUsername()),
                "messages", messages
        );
    }

    @PostMapping("/send/{receiverUsername}")
    public void sendMessage(@PathVariable String receiverUsername,
                            @RequestBody String content,
                            Principal principal) {
        User sender = getCurrentUser(principal);
        User receiver = userRepo.findByUsername(receiverUsername)
                .orElseThrow(() -> new NoSuchElementException("Receiver not found"));

        chatService.sendMessage(DisplayUserDto.from(sender), DisplayUserDto.from(receiver), content);
    }

    @PostMapping("/start/{username}")
    public ResponseEntity<Map<String, Object>> startChatWithUser(
            @PathVariable String username,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            User targetUser = userService.getUserByUsername(username);
            if (targetUser == null) {
                return ResponseEntity.notFound().build();
            }

            User currentUser = userService.getUserByUsername(authentication.getName());
            if (currentUser == null) {
                return ResponseEntity.status(401).build();
            }

            if (currentUser.getUsername().equals(targetUser.getUsername())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Cannot start chat with yourself"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("targetUser", Map.of(
                    "id", targetUser.getId(),
                    "username", targetUser.getUsername()
            ));
            response.put("currentUser", Map.of(
                    "id", currentUser.getId(),
                    "username", currentUser.getUsername()
            ));
            response.put("chatUrl", "/chat/" + targetUser.getUsername());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<Map<String, Object>> getUserInfo(@PathVariable String username) {
        try {
            User user = userService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());

            return ResponseEntity.ok(userInfo);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private User getCurrentUser(Principal principal) {
        if (principal == null) {
            throw new SecurityException("Not authenticated");
        }
        return userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
    }
}
