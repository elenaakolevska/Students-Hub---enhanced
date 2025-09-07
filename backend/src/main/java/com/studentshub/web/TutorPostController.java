package com.studentshub.web;

import com.studentshub.dto.create.CreateTutorPostDto;
import com.studentshub.dto.display.DisplayTutorPostDto;
import com.studentshub.service.application.TutorPostApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutor-posts")
public class TutorPostController {

    private final TutorPostApplicationService tutorPostApplicationService;

    public TutorPostController(TutorPostApplicationService tutorPostApplicationService) {
        this.tutorPostApplicationService = tutorPostApplicationService;
    }

    @GetMapping
    public List<DisplayTutorPostDto> findAll(@RequestParam(required = false) String tutorName,
                                             @RequestParam(required = false) String subject) {
        return tutorPostApplicationService.findByTutorNameAndSubject(tutorName, subject);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayTutorPostDto> findById(@PathVariable Long id) {
        return tutorPostApplicationService.findById(id)
                .map(tutorPost -> ResponseEntity.ok().body(tutorPost))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<DisplayTutorPostDto> save(@RequestBody CreateTutorPostDto createTutorPostDto,
                                                    Authentication authentication) {
        return tutorPostApplicationService.save(createTutorPostDto, authentication.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<DisplayTutorPostDto> update(@PathVariable Long id,
                                                      @RequestBody CreateTutorPostDto createTutorPostDto,
                                                      Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        var existingPost = tutorPostApplicationService.findById(id);
        if (existingPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (!existingPost.get().ownerUsername().equals(authentication.getName())) {
            return ResponseEntity.status(403).build();
        }

        return tutorPostApplicationService.update(id, createTutorPostDto)
                .map(tutorPost -> ResponseEntity.ok().body(tutorPost))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        var existingPost = tutorPostApplicationService.findById(id);
        if (existingPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (!existingPost.get().ownerUsername().equals(authentication.getName())) {
            return ResponseEntity.status(403).build();
        }

        tutorPostApplicationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<DisplayTutorPostDto> search(@RequestParam(required = false) String tutorName,
                                            @RequestParam(required = false) String subject) {
        return tutorPostApplicationService.findByTutorNameAndSubject(tutorName, subject);
    }
}