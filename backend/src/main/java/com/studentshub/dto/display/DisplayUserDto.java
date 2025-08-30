package com.studentshub.dto.display;

import com.studentshub.model.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record DisplayUserDto(
    Long id,
    String firstName,
    String lastName,
    String username,
    String email,
    String education,
    String profileImageUrl,
    LocalDateTime createdAt
) {
    public static DisplayUserDto from(User user) {
        return new DisplayUserDto(
            user.getId(),
            user.getFirstName() != null ? user.getFirstName() : "Unknown",
            user.getLastName() != null ? user.getLastName() : "Unknown",
            user.getUsername() != null ? user.getUsername() : "Unknown",
            user.getEmail() != null ? user.getEmail() : "Unknown",
            user.getEducation() != null ? user.getEducation() : "",
            user.getProfileImageUrl() != null ? user.getProfileImageUrl() : "",
            user.getCreatedAt()
        );
    }
    public static List<DisplayUserDto> from(List<User> users) {
        return users.stream().map(DisplayUserDto::from).collect(Collectors.toList());
    }
}
