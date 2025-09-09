package com.studentshub.web;

import com.studentshub.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class UserRestController {
    private final UserRepository userRepository;

    public UserRestController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<Map<String, String>> getUsers() {
        return userRepository.findAll().stream()
                .map(user -> Map.of("username", user.getUsername()))
                .collect(Collectors.toList());
    }
    
    @GetMapping("/users/search")
    public ResponseEntity<?> searchUsers(@RequestParam String username) {
        System.out.println("Searching for users with username containing: " + username);
        List<Map<String, Object>> results = userRepository.findByUsernameContainingIgnoreCase(username).stream()
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", user.getId());
                    map.put("username", user.getUsername());
                    map.put("firstName", user.getFirstName() != null ? user.getFirstName() : "");
                    map.put("lastName", user.getLastName() != null ? user.getLastName() : "");
                    return map;
                })
                .collect(Collectors.toList());
        System.out.println("Found " + results.size() + " users");
        return ResponseEntity.ok(results);
    }
}
