package com.studentshub.web;
import com.studentshub.dto.display.DisplayTagDto;
import com.studentshub.dto.create.CreateTagDto;
import com.studentshub.service.application.TagApplicationService;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/tags")
public class TagController {
    private final TagApplicationService tagApplicationService;
    public TagController(TagApplicationService tagApplicationService) {
        this.tagApplicationService = tagApplicationService;
    }
    @GetMapping
    public List<DisplayTagDto> listTags() {
        return tagApplicationService.findAll();
    }
    @PostMapping
    public DisplayTagDto createTag(@RequestBody CreateTagDto dto) {
        return tagApplicationService.save(dto);
    }
    @GetMapping("/{id}")
    public DisplayTagDto getTagDetails(@PathVariable Long id) {
        return tagApplicationService.findById(id).orElse(null);
    }
}
