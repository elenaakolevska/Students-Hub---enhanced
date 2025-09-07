package com.studentshub.web;
import com.studentshub.dto.create.CreateMaterialPostDto;
import com.studentshub.dto.display.DisplayMaterialPostDto;
import com.studentshub.service.application.MaterialPostApplicationService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/material-posts")
public class MaterialPostController {

    private final MaterialPostApplicationService materialPostApplicationService;

    public MaterialPostController(MaterialPostApplicationService materialPostApplicationService) {
        this.materialPostApplicationService = materialPostApplicationService;
    }

    @GetMapping
    public List<DisplayMaterialPostDto> findAll(@RequestParam(required = false) String subject) {
        return (subject == null || subject.isEmpty()) ?
                materialPostApplicationService.findAll() :
                materialPostApplicationService.findBySubject(subject);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayMaterialPostDto> findById(@PathVariable Long id) {
        return materialPostApplicationService.findById(id)
                .map(materialPost -> ResponseEntity.ok().body(materialPost))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<DisplayMaterialPostDto> save(@RequestBody CreateMaterialPostDto createMaterialPostDto,
                                                       Authentication authentication) {
        return materialPostApplicationService.save(createMaterialPostDto, authentication.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PostMapping(value = "/add-with-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DisplayMaterialPostDto> saveWithFile(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("subject") String subject,
            @RequestParam(value = "rating", required = false) Double rating,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {
            Path uploadDir = Paths.get("materialUploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String originalFileName = file.getOriginalFilename();
            String fileName = System.currentTimeMillis() + "_" + originalFileName;
            Path filePath = uploadDir.resolve(fileName);

            Files.copy(file.getInputStream(), filePath);

            CreateMaterialPostDto createMaterialPostDto = new CreateMaterialPostDto(
                    title,
                    description,
                    rating,
                    filePath.toString(),
                    originalFileName,
                    subject
            );

            return materialPostApplicationService.save(createMaterialPostDto, authentication.getName())
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.badRequest().build());

        } catch (IOException e) {
            System.err.println("Error saving file: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<DisplayMaterialPostDto> update(@PathVariable Long id,
                                                         @RequestBody CreateMaterialPostDto createMaterialPostDto) {
        return materialPostApplicationService.update(id, createMaterialPostDto)
                .map(materialPost -> ResponseEntity.ok().body(materialPost))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        if (materialPostApplicationService.findById(id).isPresent()) {
            materialPostApplicationService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/subject/{subject}")
    public List<DisplayMaterialPostDto> findBySubject(@PathVariable String subject) {
        return materialPostApplicationService.findBySubject(subject);
    }

    @GetMapping("/subjects")
    public List<String> getAllSubjects() {
        return materialPostApplicationService.findAllSubjects();
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        System.out.println("Download endpoint called for ID: " + id);
        try {
            var materialPostOpt = materialPostApplicationService.findById(id);
            if (materialPostOpt.isEmpty()) {
                System.out.println("MaterialPost not found for ID: " + id);
                return ResponseEntity.notFound().build();
            }

            var materialPost = materialPostOpt.get();
            String fileUrl = materialPost.fileUrl();
            String originalFileName = materialPost.originalFileName();

            System.out.println("Found MaterialPost - fileUrl: " + fileUrl + ", originalFileName: " + originalFileName);

            if (fileUrl == null || fileUrl.isEmpty()) {
                System.out.println("FileUrl is null or empty for MaterialPost ID: " + id);
                return ResponseEntity.notFound().build();
            }

            // Try multiple possible file locations
            Resource resource = null;
            Path filePath = null;

            // 1. Try the fileUrl as stored (for new uploads)
            try {
                filePath = Paths.get(fileUrl).normalize();
                resource = new UrlResource(filePath.toUri());
                if (resource.exists() && resource.isReadable()) {
                    System.out.println("Found file at original path: " + filePath);
                } else {
                    resource = null;
                }
            } catch (Exception e) {
                System.out.println("Could not access file at original path: " + fileUrl);
            }

            if (resource == null && originalFileName != null) {
                try {
                    filePath = Paths.get("materialUploads", originalFileName).normalize();
                    resource = new UrlResource(filePath.toUri());
                    if (resource.exists() && resource.isReadable()) {
                        System.out.println("Found file in materialUploads: " + filePath);
                    } else {
                        resource = null;
                    }
                } catch (Exception e) {
                    System.out.println("Could not access file in materialUploads: " + originalFileName);
                }
            }

            if (resource == null && originalFileName != null) {
                try {
                    filePath = Paths.get("target/classes/static/files", originalFileName).normalize();
                    resource = new UrlResource(filePath.toUri());
                    if (resource.exists() && resource.isReadable()) {
                        System.out.println("Found file in target/classes/static/files: " + filePath);
                    } else {
                        resource = null;
                    }
                } catch (Exception e) {
                    System.out.println("Could not access file in target/classes/static/files: " + originalFileName);
                }
            }

            if (resource == null && originalFileName != null) {
                try {
                    filePath = Paths.get("src/main/resources/static/files", originalFileName).normalize();
                    resource = new UrlResource(filePath.toUri());
                    if (resource.exists() && resource.isReadable()) {
                        System.out.println("Found file in src/main/resources/static/files: " + filePath);
                    } else {
                        resource = null;
                    }
                } catch (Exception e) {
                    System.out.println("Could not access file in src/main/resources/static/files: " + originalFileName);
                }
            }

            if (resource == null) {
                try {
                    String cleanPath = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl;
                    filePath = Paths.get(cleanPath).normalize();
                    resource = new UrlResource(filePath.toUri());
                    if (resource.exists() && resource.isReadable()) {
                        System.out.println("Found file at cleaned path: " + filePath);
                    } else {
                        resource = null;
                    }
                } catch (Exception e) {
                    System.out.println("Could not access file at cleaned path: " + fileUrl);
                }
            }

            if (resource == null && fileUrl.startsWith("/files/")) {
                try {
                    String resourcePath = "static" + fileUrl;
                    resource = new org.springframework.core.io.ClassPathResource(resourcePath);
                    if (resource.exists() && resource.isReadable()) {
                        System.out.println("Found file via classpath: " + resourcePath);
                        filePath = null;
                    } else {
                        resource = null;
                    }
                } catch (Exception e) {
                    System.out.println("Could not access file via classpath: " + fileUrl);
                }
            }

            if (resource != null && resource.exists() && resource.isReadable()) {
                System.out.println("File exists and is readable" + (filePath != null ? " at: " + filePath : " via classpath"));
                String contentType;
                try {
                    if (filePath != null) {
                        contentType = Files.probeContentType(filePath);
                    } else {
                        String filename = originalFileName != null ? originalFileName : resource.getFilename();
                        if (filename != null && filename.toLowerCase().endsWith(".pdf")) {
                            contentType = "application/pdf";
                        } else if (filename != null && filename.toLowerCase().endsWith(".txt")) {
                            contentType = "text/plain";
                        } else if (filename != null && filename.toLowerCase().endsWith(".doc")) {
                            contentType = "application/msword";
                        } else {
                            contentType = "application/octet-stream";
                        }
                    }
                } catch (IOException ex) {
                    contentType = "application/octet-stream";
                }

                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + (originalFileName != null ? originalFileName : resource.getFilename()) + "\"")
                        .body(resource);
            } else {
                System.out.println("File not found in any of the checked locations for MaterialPost ID: " + id);
                System.out.println("Current working directory: " + System.getProperty("user.dir"));
                Path materialUploadsDir = Paths.get("materialUploads");
                if (Files.exists(materialUploadsDir)) {
                    try {
                        System.out.println("Contents of materialUploads directory:");
                        Files.list(materialUploadsDir).forEach(path -> System.out.println("  " + path.getFileName()));
                    } catch (IOException e) {
                        System.out.println("Could not list materialUploads directory: " + e.getMessage());
                    }
                } else {
                    System.out.println("materialUploads directory does not exist at: " + materialUploadsDir.toAbsolutePath());
                }
                return ResponseEntity.notFound().build();
            }
        } catch (Exception ex) {
            System.out.println("Unexpected error: " + ex.getMessage());
            System.err.println("Error in download endpoint for ID " + id + ": " + ex.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}