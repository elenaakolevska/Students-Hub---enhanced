package com.studentshub.web;
import com.studentshub.dto.create.CreateMaterialPostDto;
import com.studentshub.dto.display.DisplayMaterialPostDto;
import com.studentshub.service.application.MaterialPostApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
}