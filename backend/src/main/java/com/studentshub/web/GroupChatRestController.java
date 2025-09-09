package com.studentshub.web;

import com.studentshub.dto.create.CreateGroupChatDto;
import com.studentshub.dto.display.DisplayGroupChatDto;
import com.studentshub.dto.display.DisplayMessageDto;
import com.studentshub.service.application.GroupChatApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/group-chats")
public class GroupChatRestController {

    @Autowired
    private GroupChatApplicationService groupChatService;

    @PostMapping
    public ResponseEntity<?> createGroupChat(@RequestBody CreateGroupChatDto dto, Principal principal) {
        try {
            DisplayGroupChatDto createdGroup = groupChatService.createGroupChat(dto, principal.getName());
            return ResponseEntity.ok(createdGroup);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<DisplayGroupChatDto>> getMyGroupChats(Principal principal) {
        List<DisplayGroupChatDto> groups = groupChatService.getGroupChatsByUser(principal.getName());
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGroupChat(@PathVariable Long id) {
        try {
            return groupChatService.getGroupChatById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<?> getGroupMessages(@PathVariable Long id) {
        try {
            List<DisplayMessageDto> messages = groupChatService.getGroupMessages(id);
            return ResponseEntity.ok(messages);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<?> sendGroupMessage(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            Principal principal) {
        try {
            String content = payload.get("content");
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Message content cannot be empty"));
            }

            DisplayMessageDto message = groupChatService.sendGroupMessage(id, principal.getName(), content);
            return ResponseEntity.ok(message);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<?> addMember(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload,
            Principal principal) {
        try {
            String username = (String) payload.get("username");
            boolean isAdmin = Boolean.parseBoolean(payload.getOrDefault("isAdmin", "false").toString());
            
            // Check if the current user is an admin of the group
            if (!groupChatService.isUserAdminOfGroup(id, principal.getName())) {
                return ResponseEntity.status(403).body(Map.of("error", "Only admins can add members"));
            }

            groupChatService.addUserToGroup(id, username, isAdmin);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/members/{username}")
    public ResponseEntity<?> removeMember(
            @PathVariable Long id,
            @PathVariable String username,
            Principal principal) {
        try {
            // Check if the current user is an admin of the group
            if (!groupChatService.isUserAdminOfGroup(id, principal.getName()) && !principal.getName().equals(username)) {
                return ResponseEntity.status(403).body(Map.of("error", "Only admins can remove members or users can remove themselves"));
            }

            groupChatService.removeUserFromGroup(id, username);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroupChat(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            Principal principal) {
        try {
            // Check if the current user is an admin of the group
            if (!groupChatService.isUserAdminOfGroup(id, principal.getName())) {
                return ResponseEntity.status(403).body(Map.of("error", "Only admins can update group details"));
            }

            String name = payload.get("name");
            String description = payload.get("description");

            DisplayGroupChatDto updatedGroup = groupChatService.updateGroupChat(id, name, description);
            return ResponseEntity.ok(updatedGroup);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroupChat(@PathVariable Long id, Principal principal) {
        try {
            // Check if the current user is an admin of the group
            if (!groupChatService.isUserAdminOfGroup(id, principal.getName())) {
                return ResponseEntity.status(403).body(Map.of("error", "Only admins can delete the group"));
            }

            groupChatService.deleteGroupChat(id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/members/check")
    public ResponseEntity<?> checkMembership(@PathVariable Long id, Principal principal) {
        try {
            boolean isMember = groupChatService.isUserMemberOfGroup(id, principal.getName());
            boolean isAdmin = groupChatService.isUserAdminOfGroup(id, principal.getName());
            
            return ResponseEntity.ok(Map.of(
                    "isMember", isMember,
                    "isAdmin", isAdmin
            ));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
