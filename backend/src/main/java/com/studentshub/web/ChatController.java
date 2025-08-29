package com.studentshub.web;
//
//import com.studentshub.model.User;
//import com.studentshub.repository.UserRepository;
//import com.studentshub.service.domain.ChatService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//
//import java.security.Principal;
//import java.time.LocalDateTime;
//import java.util.*;
//import java.util.stream.Collectors;
//
//
//
//@Controller
//@RequestMapping("/chat")
//public class ChatController {
//
//    @Autowired
//    private ChatService chatService;
//
//    @Autowired
//    private UserRepository userRepo;
//
//    @GetMapping({"", "/{username}"})
//    public String dashboardOrChat(@PathVariable(required = false) String username,
//                                  Principal principal,
//                                  Model model) {
//        if (principal == null) {
//            return "redirect:/users/login";
//        }
//
//        Optional<User> optionalUser = userRepo.findByUsername(principal.getName());
//        if (optionalUser.isEmpty()) {
//            return "redirect:/users/login?error=user_not_found";
//        }
//        User currentUser = optionalUser.get();
//
//        // Get chat partners
//        List<User> chatPartners = chatService.getChatPartners(currentUser);
//
//        // Sort chat partners by latest message timestamp (descending)
//        chatPartners.sort((u1, u2) -> {
//            LocalDateTime t1 = chatService.getLastMessageTimestamp(currentUser, u1).orElse(LocalDateTime.MIN);
//            LocalDateTime t2 = chatService.getLastMessageTimestamp(currentUser, u2).orElse(LocalDateTime.MIN);
//            return t2.compareTo(t1);  // latest first
//        });
//
//        // Get unread counts
//        Map<User, Long> unreadCounts = chatService.getUnreadMessageCounts(currentUser);
//
//        // Set of users with unread messages
//        Set<String> usersWithUnreadMessages = unreadCounts.entrySet().stream()
//                .filter(e -> e.getValue() > 0)
//                .map(e -> e.getKey().getUsername())
//                .collect(Collectors.toSet());
//
//        model.addAttribute("chatPartners", chatPartners);
//        model.addAttribute("currentUser", currentUser);
//        model.addAttribute("unreadCounts", unreadCounts);
//        model.addAttribute("usersWithUnreadMessages", usersWithUnreadMessages);
//
//        if (username != null && !username.isBlank()) {
//            Optional<User> optionalOther = userRepo.findByUsername(username);
//            if (optionalOther.isPresent()) {
//                User other = optionalOther.get();
//
//                // Mark messages as read when opening chat
//                chatService.markMessagesAsRead(other, currentUser);
//
//                model.addAttribute("receiver", other);
//                model.addAttribute("messages", chatService.getChat(currentUser, other));
//
//                // Refresh unread counts after marking as read
//                unreadCounts = chatService.getUnreadMessageCounts(currentUser);
//
//                // Update set after marking as read
//                usersWithUnreadMessages = unreadCounts.entrySet().stream()
//                        .filter(e -> e.getValue() > 0)
//                        .map(e -> e.getKey().getUsername())
//                        .collect(Collectors.toSet());
//
//                model.addAttribute("unreadCounts", unreadCounts);
//                model.addAttribute("usersWithUnreadMessages", usersWithUnreadMessages);
//            } else {
//                model.addAttribute("receiver", null);
//                model.addAttribute("messages", null);
//            }
//        } else {
//            model.addAttribute("receiver", null);
//            model.addAttribute("messages", null);
//        }
//
//        return "chat/dashboard";
//    }
//
//}



import com.studentshub.dto.display.DisplayMessageDto;
import com.studentshub.dto.display.DisplayUserDto;
import com.studentshub.model.User;
import com.studentshub.repository.UserRepository;
import com.studentshub.service.application.ChatApplicationService;
import lombok.RequiredArgsConstructor;
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

    // Get all chat partners with unread info
    @GetMapping("/partners")
    public List<Map<String, Object>> getChatPartners(Principal principal) {
        User currentUser = getCurrentUser(principal);
        DisplayUserDto currentUserDto = DisplayUserDto.from(currentUser);
        List<DisplayUserDto> partners = chatService.getChatPartners(currentUserDto);

        // Sort partners by latest message timestamp
        partners.sort((u1, u2) -> {
            LocalDateTime t1 = chatService.getLastMessageTimestamp(currentUserDto, u1).orElse(LocalDateTime.MIN);
            LocalDateTime t2 = chatService.getLastMessageTimestamp(currentUserDto, u2).orElse(LocalDateTime.MIN);
            return t2.compareTo(t1);
        });

        // Get unread counts
        Map<DisplayUserDto, Long> unreadCounts = chatService.getUnreadMessageCounts(currentUserDto);

        // Map each partner to a simple JSON-friendly structure
        return partners.stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.id(),
                        "username", u.username(),
                        "unreadCount", unreadCounts.getOrDefault(u, 0L)
                ))
                .collect(Collectors.toList());

    }

    // Get chat messages with a specific user
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

        // Mark messages as read
        chatService.markMessagesAsRead(otherDto, currentUserDto);

        List<DisplayMessageDto> messages = chatService.getChat(currentUserDto, otherDto);

        return Map.of(
                "currentUser", Map.of("id", currentUser.getId(), "username", currentUser.getUsername()),
                "receiver", Map.of("id", other.getId(), "username", other.getUsername()),
                "messages", messages
        );
    }

    // Send a message
    @PostMapping("/send/{receiverUsername}")
    public void sendMessage(@PathVariable String receiverUsername,
                            @RequestBody String content,
                            Principal principal) {
        User sender = getCurrentUser(principal);
        User receiver = userRepo.findByUsername(receiverUsername)
                .orElseThrow(() -> new NoSuchElementException("Receiver not found"));

        chatService.sendMessage(DisplayUserDto.from(sender), DisplayUserDto.from(receiver), content);
    }

    // Helper method to fetch current user from Principal
    private User getCurrentUser(Principal principal) {
        if (principal == null) {
            throw new SecurityException("Not authenticated");
        }
        return userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
    }
}
