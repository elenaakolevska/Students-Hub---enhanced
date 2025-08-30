package com.studentshub.web;
import com.studentshub.dto.create.CreateUserDto;
import com.studentshub.dto.display.DisplayUserDto;
import com.studentshub.dto.create.LoginDto;
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
    public DisplayUserDto registerUser(@RequestBody CreateUserDto dto) {
        return userApplicationService.save(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        return userApplicationService.authenticate(loginDto.getUsername(), loginDto.getPassword())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).<DisplayUserDto>body(null));
    }

    @GetMapping("/profile/{username}")
    public DisplayUserDto getUserProfile(@PathVariable String username) {
        return userApplicationService.findByUsername(username).orElse(null);
    }
}
