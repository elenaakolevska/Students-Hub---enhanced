package com.studentshub.web;

import com.studentshub.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
public class PublicSearchController {
    private final UserRepository userRepository;

    public PublicSearchController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/search-users")
    public ResponseEntity<?> searchUsers(@RequestParam String query) {
        System.out.println("PublicSearchController: Searching for users with username containing: " + query);
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
            System.out.println("PublicSearchController: Found " + results.size() + " users");
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("Error in search users: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
