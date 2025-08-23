package com.studentshub.web;

import com.studentshub.model.MaterialPost;
import com.studentshub.model.User;
import com.studentshub.model.enumerations.PostCategory;
import com.studentshub.service.FavoriteService;
import com.studentshub.service.MaterialPostService;
import com.studentshub.service.TagService;
import com.studentshub.service.UserService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/material-posts")
public class MaterialPostController {

    private final MaterialPostService materialPostService;
    private final UserService userService;
    private final FavoriteService favoriteService;


    public MaterialPostController(MaterialPostService materialPostService, UserService userService, FavoriteService favoriteService) {
        this.materialPostService = materialPostService;
        this.userService = userService;
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public String listMaterialPosts(@RequestParam(required = false) String subject, Model model) {
        List<MaterialPost> posts;

        if (subject == null || subject.isEmpty()) {
            posts = materialPostService.findAll();
        } else {
            posts = materialPostService.findBySubject(subject);
        }

        List<String> allSubjects = materialPostService.findAllSubjects();

        model.addAttribute("materialPosts", posts);
        model.addAttribute("subjects", allSubjects);
        model.addAttribute("subject", subject);

        return "material-posts/list";
    }



    @GetMapping("/{id}")
    public String viewMaterialPost(@PathVariable Long id, Model model) {
        MaterialPost post = materialPostService.findById(id);
        model.addAttribute("materialPost", post);
        User currentUser = userService.getCurrentUser();
        model.addAttribute("currentUser", currentUser);
        return "material-posts/details";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("materialPost", new MaterialPost());
        model.addAttribute("categories", PostCategory.values());
        return "material-posts/form";
    }

    @PostMapping
    public String createMaterialPost(
            @ModelAttribute MaterialPost post,
            @RequestParam("file") MultipartFile file,
            Principal principal
    ) {
        if (!file.isEmpty()) {
            try {
                Path uploadPath = Paths.get(System.getProperty("user.home"), "StudentsHub", "materialUploads");

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

                Path filePath = uploadPath.resolve(fileName);
                file.transferTo(filePath.toFile());

                post.setFileUrl(filePath.toString());
                post.setOriginalFileName(file.getOriginalFilename());

            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("Неуспешно прикачување на фајл");
            }
        }

        materialPostService.create(post, principal.getName());
        return "redirect:/material-posts";
    }



    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        MaterialPost post = materialPostService.findById(id);
        model.addAttribute("materialPost", post);
        model.addAttribute("categories", PostCategory.values());
        return "material-posts/form";
    }

    @PostMapping("/update")
    public String updateMaterialPost(@ModelAttribute MaterialPost post) {
        if (post.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing post ID");
        }
        materialPostService.update(post.getId(), post);
        return "redirect:/material-posts";
    }

    @PostMapping("/delete/{id}")
    public String deleteMaterialPost(@PathVariable Long id) {
        favoriteService.deleteAllByPostId(id);
        materialPostService.delete(id);
        return "redirect:/material-posts";
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        MaterialPost post = materialPostService.findById(id);

        if (post == null || post.getFileUrl() == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            Path filePath = Paths.get(post.getFileUrl());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + post.getOriginalFileName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/filter")
    public String filterBySubject(@RequestParam String subject, Model model) {
        List<MaterialPost> filteredPosts = materialPostService.findBySubject(subject);
        model.addAttribute("materialPosts", filteredPosts);
        return "material-posts/list";
    }



}
