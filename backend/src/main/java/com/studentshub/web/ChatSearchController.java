package com.studentshub.web;

import com.studentshub.model.User;
import com.studentshub.repository.UserRepository;
import com.studentshub.service.domain.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/chat")
public class ChatSearchController {
    private final UserRepository userRepository;

    public ChatSearchController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/search-users")
    @CrossOrigin(origins = "*") // Add explicit CORS at method level
    public ResponseEntity<?> searchUsers(@RequestParam String query) {
        System.out.println("ChatSearchController: Searching for users with username containing: " + query);
        try {
            List<Map<String, Object>> results = userRepository.findByUsernameContainingIgnoreCase(query).stream()
                    .map(user -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", user.getId());
                        map.put("username", user.getUsername());
                        map.put("firstName", user.getFirstName() != null ? user.getFirstName() : "");
                        map.put("lastName", user.getLastName() != null ? user.getLastName() : "");
                        return map;
                    })
                    .collect(Collectors.toList());
            System.out.println("ChatSearchController: Found " + results.size() + " users");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("Error in search users: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
