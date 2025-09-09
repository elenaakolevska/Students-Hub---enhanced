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
import java.util.stream.Collectors;
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
    
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam(required = true) String username) {
        System.out.println("UserController: Searching for users with username containing: " + username);
        try {
            List<Map<String, Object>> results = userService.findByUsernameContaining(username).stream()
                    .map(user -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", user.getId());
                        map.put("username", user.getUsername());
                        map.put("firstName", user.getFirstName() != null ? user.getFirstName() : "");
                        map.put("lastName", user.getLastName() != null ? user.getLastName() : "");
                        return map;
                    })
                    .collect(Collectors.toList());
            System.out.println("UserController: Found " + results.size() + " users");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("Error in search users: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
