package com.studentshub.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class GroupChat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    @ManyToOne
    private User createdBy;
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupChatMembers> members = new ArrayList<>();

    public GroupChat(Long id, String name, String description, User createdBy, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public GroupChat() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<GroupChatMembers> getMembers() {
        return members;
    }

    public void setMembers(List<GroupChatMembers> members) {
        this.members = members;
    }
    
    public void addMember(User user) {
        GroupChatMembers member = new GroupChatMembers();
        member.setUser(user);
        member.setGroup(this);
        member.setJoinedAt(LocalDateTime.now());
        this.members.add(member);
    }
    
    public void removeMember(User user) {
        this.members.removeIf(member -> member.getUser().equals(user));
    }
}