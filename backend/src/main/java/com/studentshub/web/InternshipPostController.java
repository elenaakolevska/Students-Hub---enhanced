package com.studentshub.web;

import com.studentshub.dto.create.CreateInternshipPostDto;
import com.studentshub.dto.display.DisplayInternshipPostDto;
import com.studentshub.service.application.InternshipPostApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internship-posts")
public class InternshipPostController {

    private final InternshipPostApplicationService internshipPostApplicationService;

    public InternshipPostController(InternshipPostApplicationService internshipPostApplicationService) {
        this.internshipPostApplicationService = internshipPostApplicationService;
    }

    @GetMapping
    public List<DisplayInternshipPostDto> findAll(@RequestParam(required = false) String faculty) {
        return (faculty != null && !faculty.isEmpty()) ?
                internshipPostApplicationService.findByFacultyFilter(faculty) :
                internshipPostApplicationService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayInternshipPostDto> findById(@PathVariable Long id) {
        return internshipPostApplicationService.findById(id)
                .map(internshipPost -> ResponseEntity.ok().body(internshipPost))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<DisplayInternshipPostDto> save(@RequestBody CreateInternshipPostDto createInternshipPostDto,
                                                         Authentication authentication) {
        return internshipPostApplicationService.save(createInternshipPostDto, authentication.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<DisplayInternshipPostDto> update(@PathVariable Long id,
                                                           @RequestBody CreateInternshipPostDto createInternshipPostDto) {
        return internshipPostApplicationService.update(id, createInternshipPostDto)
                .map(internshipPost -> ResponseEntity.ok().body(internshipPost))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        if (internshipPostApplicationService.findById(id).isPresent()) {
            internshipPostApplicationService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/faculty/{faculty}")
    public List<DisplayInternshipPostDto> findByFaculty(@PathVariable String faculty) {
        return internshipPostApplicationService.findByFacultyFilter(faculty);
    }
}
