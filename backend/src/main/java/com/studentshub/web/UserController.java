package com.studentshub.web;
import com.studentshub.model.*;
import com.studentshub.model.exceptions.DuplicateUsernameException;
import com.studentshub.service.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
@Controller
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String listUsers(Model model) {
        model.addAttribute("users", userService.findAll());
        return "users/list";
    }

    @GetMapping("/{id}")
    public String getUserDetails(@PathVariable Long id, Model model) {
        User user = userService.getUserById(id);
        model.addAttribute("user", user);
        return "users/details";
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "users/register";
    }

    @PostMapping("/register")
    public String registerUser(@ModelAttribute User user,Model model) {
        try {
            User savedUser = userService.createUser(user);
            return "redirect:/users/login";
        } catch (DuplicateUsernameException e) {
            model.addAttribute("errorMessage", e.getMessage());
            model.addAttribute("user", user);
            return "users/register";
        }

    }

    @GetMapping("/login")
    public String showLoginForm(Model model) {
        model.addAttribute("user", new User());
        return "users/login";
    }

    @GetMapping("/profile/{username}")
    public String getUserProfile(@PathVariable String username, Model model) {
        User user = userService.getUserByUsername(username);
        if (user == null) {
            // User not found - redirect with error param or show error page
            return "redirect:/users?error=user_not_found";
        }
        model.addAttribute("user", user);
        return "users/profileinfo";  // Template name, ensure this file exists
    }


}
