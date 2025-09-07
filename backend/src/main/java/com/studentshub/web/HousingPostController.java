package com.studentshub.web;

import com.studentshub.dto.create.CreateHousingPostDto;
import com.studentshub.dto.display.DisplayHousingPostDto;
import com.studentshub.service.application.HousingPostApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/housing-posts")
public class HousingPostController {

    private final HousingPostApplicationService housingPostApplicationService;

    public HousingPostController(HousingPostApplicationService housingPostApplicationService) {
        this.housingPostApplicationService = housingPostApplicationService;
    }

    @GetMapping
    public List<DisplayHousingPostDto> findAll(@RequestParam(required = false) String municipality) {
        return (municipality != null && !municipality.isEmpty()) ?
                housingPostApplicationService.findByMunicipality(municipality) :
                housingPostApplicationService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayHousingPostDto> findById(@PathVariable Long id) {
        return housingPostApplicationService.findById(id)
                .map(housingPost -> ResponseEntity.ok().body(housingPost))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<DisplayHousingPostDto> save(@RequestBody CreateHousingPostDto createHousingPostDto,
                                                      Authentication authentication) {
        return housingPostApplicationService.save(createHousingPostDto, authentication.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<DisplayHousingPostDto> update(@PathVariable Long id,
                                                        @RequestBody CreateHousingPostDto createHousingPostDto,
                                                        Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        var existingPost = housingPostApplicationService.findById(id);
        if (existingPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (!existingPost.get().ownerUsername().equals(authentication.getName())) {
            return ResponseEntity.status(403).build();
        }

        return housingPostApplicationService.update(id, createHousingPostDto)
                .map(housingPost -> ResponseEntity.ok().body(housingPost))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        var existingPost = housingPostApplicationService.findById(id);
        if (existingPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (!existingPost.get().ownerUsername().equals(authentication.getName())) {
            return ResponseEntity.status(403).build();
        }

        housingPostApplicationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/municipality/{municipality}")
    public List<DisplayHousingPostDto> findByMunicipality(@PathVariable String municipality) {
        return housingPostApplicationService.findByMunicipality(municipality);
    }

    @GetMapping("/municipalities")
    public List<String> getAllMunicipalities() {
        return housingPostApplicationService.getAllMunicipalities();
    }
}