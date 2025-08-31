package com.studentshub.web;
import com.studentshub.config.JwtService;
import com.studentshub.dto.create.CreateUserDto;
import com.studentshub.dto.display.DisplayUserDto;
import com.studentshub.dto.display.JwtAuthResponse;
import com.studentshub.dto.create.LoginDto;
import com.studentshub.service.domain.UserService;
import org.springframework.http.ResponseEntity;
import com.studentshub.service.application.UserApplicationService;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserApplicationService userApplicationService;
    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserApplicationService userApplicationService, UserService userService, JwtService jwtService) {
        this.userApplicationService = userApplicationService;
        this.userService = userService;
        this.jwtService = jwtService;
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
        Optional<DisplayUserDto> userOptional = userApplicationService.authenticate(loginDto.getUsername(), loginDto.getPassword());
        
        if (userOptional.isPresent()) {
            DisplayUserDto user = userOptional.get();
            UserDetails userDetails = userService.loadUserByUsername(user.username());
            String jwtToken = jwtService.generateToken(userDetails);
            return ResponseEntity.ok(new JwtAuthResponse(jwtToken, user));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @GetMapping("/profile/{username}")
    public DisplayUserDto getUserProfile(@PathVariable String username) {
        return userApplicationService.findByUsername(username).orElse(null);
    }
}
