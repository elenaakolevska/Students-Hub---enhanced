package com.studentshub.model;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
public class GroupChatMembers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private GroupChat group;

    @ManyToOne
    private User user;
    
    private LocalDateTime joinedAt;
    private boolean isAdmin;

    public GroupChatMembers(Long id, GroupChat group, User user, LocalDateTime joinedAt, boolean isAdmin) {
        this.id = id;
        this.group = group;
        this.user = user;
        this.joinedAt = joinedAt;
        this.isAdmin = isAdmin;
    }

    public GroupChatMembers() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
    
    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
    
    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }
}