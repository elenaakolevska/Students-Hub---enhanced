package com.studentshub.model;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity

public class GroupChatMembers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private GroupChat group;

    @ManyToOne
    private User user;

    public GroupChatMembers(Long id, GroupChat group, User user) {
        this.id = id;
        this.group = group;
        this.user = user;
    }

    public GroupChatMembers() {
    }

    public GroupChat getGroup() {
        return group;
    }

    public void setGroup(GroupChat group) {
        this.group = group;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}