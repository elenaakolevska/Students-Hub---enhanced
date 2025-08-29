//package com.studentshub.web;
//import com.studentshub.model.*;
//import com.studentshub.repository.UserRepository;
//import com.studentshub.service.*;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.SendTo;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@Controller
//@RequestMapping("/messages")
//public class MessageController {
//
//    private final MessageService messageService;
//    private final UserService userService;
//    private final GroupChatService groupChatService;
//
//    public MessageController(MessageService messageService, UserService userService, GroupChatService groupChatService) {
//        this.messageService = messageService;
//        this.userService = userService;
//        this.groupChatService = groupChatService;
//    }
//
//    @GetMapping("/group/{groupId}")
//    public String getGroupMessages(@PathVariable Long groupId, Model model) {
//        GroupChat group = groupChatService.getGroupChatById(groupId);
//        List<Message> messages = messageService.getMessagesInGroup(group);
//        model.addAttribute("group", group);
//        model.addAttribute("messages", messages);
//        return "messages/groupMessages";
//    }
//
//    @PostMapping("/send")
//    public String sendMessage(@RequestParam Long senderId,
//                              @RequestParam Long receiverId,
//                              @RequestParam(required = false) Long groupId,
//                              @RequestParam String content) {
//        User sender = userService.getUserById(senderId);
//        User receiver = userService.getUserById(receiverId);
//        GroupChat group = groupChatService.getGroupChatById(groupId);
//        messageService.sendMessage(sender, receiver, group, content);
//        return "redirect:/messages/group/" + groupId;
//    }
//
//    ///////////////////////////////
//    @Autowired
//    ChatService chatService;
//    @Autowired
//    UserRepository userRepo;
//
//    @MessageMapping("/chat")
//    @SendTo("/topic/messages")
//    public ChatMessage send(ChatMessage message) {
//        User sender = userRepo.findByUsername(message.getSender()).orElseThrow();
//        User receiver = userRepo.findByUsername(message.getReceiver()).orElseThrow();
//        chatService.send(sender, receiver, message.getContent());
//        return message;
//    }
//
//}
//

package com.studentshub.web;

import com.studentshub.model.*;
import com.studentshub.service.*;
import com.studentshub.repository.UserRepository;
import com.studentshub.service.application.ChatApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserService userService;
    private final GroupChatService groupChatService;
    private final ChatApplicationService chatService;
    private final UserRepository userRepo;

    // ================= GROUP MESSAGES =================

    @GetMapping("/group/{groupId}")
    public Map<String, Object> getGroupMessages(@PathVariable Long groupId) {
        GroupChat group = groupChatService.getGroupChatById(groupId);
        List<Message> messages = messageService.getMessagesInGroup(group);
        return Map.of(
                "group", group,
                "messages", messages
        );
    }

    @PostMapping("/group/send")
    public Map<String, Object> sendGroupMessage(@RequestParam Long senderId,
                                                @RequestParam Long groupId,
                                                @RequestParam String content) {
        User sender = userService.getUserById(senderId);
        GroupChat group = groupChatService.getGroupChatById(groupId);

        messageService.sendMessage(sender, null, group, content);

        return Map.of("status", "ok", "groupId", groupId);
    }

    // ================= ONE-TO-ONE CHAT =================

    @GetMapping("/chat/partners")
    public List<Map<String, Object>> getChatPartners(Principal principal) {
        User currentUser = getCurrentUser(principal);
        List<User> partners = chatService.getChatPartners(currentUser);
        return partners.stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "username", u.getUsername()
                ))
                .toList();
    }

    @GetMapping("/chat/{username}")
    public Map<String, Object> getChatWith(@PathVariable String username, Principal principal) {
        User currentUser = getCurrentUser(principal);
        User other = userRepo.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        chatService.markMessagesAsRead(other, currentUser);
        List<Message> messages = chatService.getChat(currentUser, other);

        return Map.of(
                "currentUser", Map.of("id", currentUser.getId(), "username", currentUser.getUsername()),
                "receiver", Map.of("id", other.getId(), "username", other.getUsername()),
                "messages", messages
        );
    }

    @PostMapping("/chat/send/{receiverUsername}")
    public Map<String, Object> sendMessage(@PathVariable String receiverUsername,
                                           @RequestBody Map<String, String> body,
                                           Principal principal) {
        String content = body.get("content");
        User sender = getCurrentUser(principal);
        User receiver = userRepo.findByUsername(receiverUsername)
                .orElseThrow(() -> new NoSuchElementException("Receiver not found"));

        chatService.sendMessage(sender, receiver, content);
        return Map.of("status", "ok", "receiver", receiverUsername);
    }

    // ================= HELPER =================
    private User getCurrentUser(Principal principal) {
        if (principal == null) throw new SecurityException("Not authenticated");
        return userRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
    }
}
