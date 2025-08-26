package com.studentshub.dto.create;

import com.studentshub.model.User;
import java.time.LocalDateTime;

public record CreateUserDto(
    String firstName,
    String lastName,
    String username,
    String email,
    String password,
    String education,
    String profileImageUrl,
    LocalDateTime createdAt,
    String role
) {
    public User toUser() {
        User user = new User(null, firstName, lastName, username, email, password, education, createdAt, null, null, null, null, role);
        user.setProfileImageUrl(profileImageUrl);
        return user;
    }
    public String role() {
        return role;
    }
}
