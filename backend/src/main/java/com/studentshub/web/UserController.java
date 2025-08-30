package com.studentshub.web;
import com.studentshub.dto.create.CreateUserDto;
import com.studentshub.dto.display.DisplayUserDto;
import org.springframework.http.ResponseEntity;
import com.studentshub.service.application.UserApplicationService;

import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserApplicationService userApplicationService;

    public UserController(UserApplicationService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }

    @GetMapping
    public List<DisplayUserDto> listUsers() {
        return userApplicationService.findAll();
    }

    @GetMapping("/{id}")
    public DisplayUserDto getUserDetails(@PathVariable Long id) {
        return userApplicationService.findById(id).orElse(null);
    }


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody CreateUserDto dto) {
        // Validate required fields
        if (dto.firstName() == null || dto.firstName().trim().isEmpty() ||
            dto.lastName() == null || dto.lastName().trim().isEmpty() ||
            dto.username() == null || dto.username().trim().isEmpty() ||
            dto.email() == null || dto.email().trim().isEmpty() ||
            dto.password() == null || dto.password().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Missing required user fields");
        }
        DisplayUserDto user = userApplicationService.save(dto);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/login")
    public String loginPage() {
        return "users/login";
    }

    @GetMapping("/profile/{username}")
    public DisplayUserDto getUserProfile(@PathVariable String username) {
        return userApplicationService.findByUsername(username).orElse(null);
    }
}
