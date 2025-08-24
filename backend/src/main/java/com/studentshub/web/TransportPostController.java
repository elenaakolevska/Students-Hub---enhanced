package com.studentshub.web;

import com.studentshub.dto.create.CreateTransportPostDto;
import com.studentshub.dto.display.DisplayTransportPostDto;
import com.studentshub.service.application.TransportPostApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transport-posts")
public class TransportPostController {

    private final TransportPostApplicationService transportPostApplicationService;

    public TransportPostController(TransportPostApplicationService transportPostApplicationService) {
        this.transportPostApplicationService = transportPostApplicationService;
    }

    @GetMapping
    public List<DisplayTransportPostDto> findAll(@RequestParam(required = false) String locationFrom,
                                                 @RequestParam(required = false) String locationTo) {
        return transportPostApplicationService.findByLocationFromAndLocationTo(locationFrom, locationTo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayTransportPostDto> findById(@PathVariable Long id) {
        return transportPostApplicationService.findById(id)
                .map(transportPost -> ResponseEntity.ok().body(transportPost))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<DisplayTransportPostDto> save(@RequestBody CreateTransportPostDto createTransportPostDto,
                                                        Authentication authentication) {
        return transportPostApplicationService.save(createTransportPostDto, authentication.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<DisplayTransportPostDto> update(@PathVariable Long id,
                                                          @RequestBody CreateTransportPostDto createTransportPostDto) {
        return transportPostApplicationService.update(id, createTransportPostDto)
                .map(transportPost -> ResponseEntity.ok().body(transportPost))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        if (transportPostApplicationService.findById(id).isPresent()) {
            transportPostApplicationService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/route")
    public List<DisplayTransportPostDto> findByRoute(@RequestParam(required = false) String from,
                                                     @RequestParam(required = false) String to) {
        return transportPostApplicationService.findByLocationFromAndLocationTo(from, to);
    }
}