package com.studentshub.web;

import com.studentshub.config.FileStorageConfig;
import com.studentshub.model.DTO.UserDto;
import com.studentshub.model.User;
import com.studentshub.model.exceptions.UserNotFoundException;
import com.studentshub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.Optional;
import java.util.UUID;

@Controller
@RequestMapping("/profile")
public class ProfileController {

    private final UserService userService;

    @Autowired
    private FileStorageConfig fileStorageConfig;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String getProfilePage(Model model, Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        model.addAttribute("user", user);

        // Пополнување на UserDto со постоечките вредности за формата
        UserDto userDto = new UserDto();
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setEducation(user.getEducation());
        userDto.setUsername(user.getUsername()); // важно!
        userDto.setProfileImageUrl(user.getProfileImageUrl());
        model.addAttribute("userDto", userDto);

        return "users/profile";
    }

    @PostMapping("/update")
    public String updateProfile(@ModelAttribute UserDto userDto,
                                @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
                                RedirectAttributes redirectAttributes) {
        try {
            Optional<User> optionalUser = Optional.ofNullable(
                    userService.getUserByUsername(userDto.getUsername())
            );

            if (optionalUser.isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "User not found!");
                return "redirect:/profile";
            }

            User user = optionalUser.get();

            // Ажурирај ги вредностите
            user.setFirstName(userDto.getFirstName());
            user.setLastName(userDto.getLastName());
            user.setEmail(userDto.getEmail());
            user.setEducation(userDto.getEducation());

            // Ако има слика, сними ја
            if (profileImage != null && !profileImage.isEmpty()) {
                String filename = UUID.randomUUID().toString() + "_" + profileImage.getOriginalFilename();
                Path uploadPath = Paths.get(fileStorageConfig.getUploadDir());

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                Path filePath = uploadPath.resolve(filename);
                Files.copy(profileImage.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                String imageUrl = "/uploads/" + filename;
                user.setProfileImageUrl(imageUrl);
            }

            userService.updateUser(user);
            redirectAttributes.addFlashAttribute("success", "Profile updated successfully!");

        } catch (IOException e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Failed to upload image: " + e.getMessage());
        }

        return "redirect:/profile";
    }
}