package com.studentshub.web;

import com.studentshub.config.FileStorageConfig;
import com.studentshub.dto.create.CreateUserDto;
import com.studentshub.dto.display.DisplayUserDto;
import com.studentshub.model.User;
import com.studentshub.service.application.UserApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/profile")
public class ProfileController {
    private final UserApplicationService userApplicationService;

    @Autowired
    private FileStorageConfig fileStorageConfig;

    public ProfileController(UserApplicationService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }

    @GetMapping("/{username}")
    public DisplayUserDto getProfile(@PathVariable String username) {
        return userApplicationService.findByUsername(username).orElse(null);
    }

    @PutMapping("/update/{username}")
    public DisplayUserDto updateProfile(@PathVariable String username, @RequestBody CreateUserDto dto) {
        // You may want to add authentication/authorization here
        return userApplicationService.updateProfile(username, dto).orElse(null);
    }
}