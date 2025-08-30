// ...existing code...
package com.studentshub.service.application.impl;

import com.studentshub.dto.create.CreateUserDto;
import com.studentshub.dto.display.DisplayUserDto;
import com.studentshub.model.User;
import com.studentshub.service.domain.UserService;
import com.studentshub.service.application.UserApplicationService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserApplicationServiceImpl implements UserApplicationService {


    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserApplicationServiceImpl(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<DisplayUserDto> authenticate(String username, String password) {
        try {
            User user = userService.getUserByUsername(username);
            if (user != null && user.getPassword() != null && passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(DisplayUserDto.from(user));
            }
            return Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public List<DisplayUserDto> findAll() {
        return userService.findAll().stream()
                .map(DisplayUserDto::from)
                .toList();
    }

    @Override
    public Optional<DisplayUserDto> findById(Long id) {
        try {
            User user = userService.getUserById(id);
            return Optional.of(DisplayUserDto.from(user));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public DisplayUserDto save(CreateUserDto dto) {
        User user = dto.toUser();
        User saved = userService.createUser(user);
        return DisplayUserDto.from(saved);
    }

    @Override
    public Optional<DisplayUserDto> update(Long id, CreateUserDto dto) {
        try {
            User existing = userService.getUserById(id);
            existing.setUsername(dto.username());
            existing.setEmail(dto.email());
            existing.setPassword(dto.password());
            existing.setFirstName(dto.firstName());
            existing.setLastName(dto.lastName());
            existing.setEducation(dto.education());
            existing.setProfileImageUrl(dto.profileImageUrl());
            existing.setCreatedAt(dto.createdAt());
            User updated = userService.updateUser(existing);
            return Optional.of(DisplayUserDto.from(updated));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<DisplayUserDto> deleteById(Long id) {
        try {
            User user = userService.getUserById(id);
            userService.deleteUser(id);
            return Optional.of(DisplayUserDto.from(user));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<DisplayUserDto> findByUsername(String username) {
        try {
            User user = userService.getUserByUsername(username);
            return Optional.of(DisplayUserDto.from(user));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<DisplayUserDto> findByEmail(String email) {
        try {
            User user = userService.findAll().stream()
                    .filter(u -> u.getEmail().equals(email))
                    .findFirst()
                    .orElse(null);
            return user != null ? Optional.of(DisplayUserDto.from(user)) : Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<DisplayUserDto> updateProfile(String username, CreateUserDto dto) {
        try {
            User existing = userService.getUserByUsername(username);
            existing.setUsername(dto.username());
            existing.setEmail(dto.email());
            existing.setPassword(dto.password());
            existing.setFirstName(dto.firstName());
            existing.setLastName(dto.lastName());
            existing.setEducation(dto.education());
            existing.setProfileImageUrl(dto.profileImageUrl());
            existing.setCreatedAt(dto.createdAt());
            User updated = userService.updateUser(existing);
            return Optional.of(DisplayUserDto.from(updated));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}