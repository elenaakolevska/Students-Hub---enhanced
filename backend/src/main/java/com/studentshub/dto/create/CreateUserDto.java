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
    LocalDateTime createdAt
) {
    public User toUser() {
        return new User(null, firstName, lastName, username, email, password, education, createdAt, null, null, null, null);
    }
}

