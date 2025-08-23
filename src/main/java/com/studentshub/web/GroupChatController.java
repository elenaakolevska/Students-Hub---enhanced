package com.studentshub.web;
import com.studentshub.model.*;
import com.studentshub.service.GroupChatService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
@Controller
@RequestMapping("/groups")
public class GroupChatController {

    private final GroupChatService groupChatService;

    public GroupChatController(GroupChatService groupChatService) {
        this.groupChatService = groupChatService;
    }

    @GetMapping("/user/{userId}")
    public String getGroupsByUser(@PathVariable Long userId, Model model) {
        User user = new User();
        user.setId(userId);
        model.addAttribute("groups", groupChatService.getGroupsByUser(user));
        return "groups/list";
    }

    @PostMapping("/create")
    public String createGroup(@RequestParam String name, @RequestParam Long creatorId) {
        User creator = new User();
        creator.setId(creatorId);
        groupChatService.createGroupChat(name, creator);
        return "redirect:/groups/user/" + creatorId;
    }

    @PostMapping("/addUser")
    public String addUserToGroup(@RequestParam Long groupId, @RequestParam Long userId) {
        GroupChat group = new GroupChat();
        group.setId(groupId);
        User user = new User();
        user.setId(userId);
        groupChatService.addUserToGroup(group, user);
        return "redirect:/groups/user/" + userId;
    }

    @PostMapping("/removeUser")
    public String removeUserFromGroup(@RequestParam Long groupId, @RequestParam Long userId) {
        GroupChat group = new GroupChat();
        group.setId(groupId);
        User user = new User();
        user.setId(userId);
        groupChatService.removeUserFromGroup(group, user);
        return "redirect:/groups/user/" + userId;
    }
}

