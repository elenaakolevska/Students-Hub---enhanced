package com.studentshub.web;

import com.studentshub.dto.create.CreateEventPostDto;
import com.studentshub.dto.display.DisplayEventPostDto;
import com.studentshub.model.enumerations.EventCategory;
import com.studentshub.service.application.EventPostApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-posts")
public class EventPostController {

    private final EventPostApplicationService eventPostApplicationService;

    public EventPostController(EventPostApplicationService eventPostApplicationService) {
        this.eventPostApplicationService = eventPostApplicationService;
    }

    @GetMapping
    public List<DisplayEventPostDto> findAll(@RequestParam(required = false) EventCategory category) {
        return (category == null) ?
                eventPostApplicationService.findAll() :
                eventPostApplicationService.findByEventCategory(category);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayEventPostDto> findById(@PathVariable Long id) {
        return eventPostApplicationService.findById(id)
                .map(eventPost -> ResponseEntity.ok().body(eventPost))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<DisplayEventPostDto> save(@RequestBody CreateEventPostDto createEventPostDto,
                                                    Authentication authentication) {
        return eventPostApplicationService.save(createEventPostDto, authentication.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<DisplayEventPostDto> update(@PathVariable Long id,
                                                      @RequestBody CreateEventPostDto createEventPostDto) {
        return eventPostApplicationService.update(id, createEventPostDto)
                .map(eventPost -> ResponseEntity.ok().body(eventPost))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        if (eventPostApplicationService.findById(id).isPresent()) {
            eventPostApplicationService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/category/{category}")
    public List<DisplayEventPostDto> findByCategory(@PathVariable EventCategory category) {
        return eventPostApplicationService.findByEventCategory(category);
    }
}