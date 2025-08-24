package com.studentshub.service.application.impl;

import com.studentshub.dto.create.CreateHousingPostDto;
import com.studentshub.dto.display.DisplayHousingPostDto;
import com.studentshub.model.User;
import com.studentshub.service.application.HousingPostApplicationService;
import com.studentshub.service.domain.HousingPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HousingPostApplicationServiceImpl implements HousingPostApplicationService {
    private final HousingPostService housingPostService;
    private final UserService userService;

    public HousingPostApplicationServiceImpl(HousingPostService housingPostService, UserService userService) {
        this.housingPostService = housingPostService;
        this.userService = userService;
    }

    @Override
    public Optional<DisplayHousingPostDto> findById(Long id) {
        var housingPost = housingPostService.findById(id);
        return Optional.of(DisplayHousingPostDto.from(housingPost));
    }

    @Override
    public List<DisplayHousingPostDto> findAll() {
        return housingPostService.findAll().stream()
                .map(DisplayHousingPostDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<DisplayHousingPostDto> save(CreateHousingPostDto createHousingPostDto, String username) {
        User owner = userService.getUserByUsername(username);
        var housingPost = housingPostService.create(createHousingPostDto.toHousingPost(owner), username);
        return Optional.of(DisplayHousingPostDto.from(housingPost));
    }

    @Override
    public Optional<DisplayHousingPostDto> update(Long id, CreateHousingPostDto createHousingPostDto) {
        var existingPost = housingPostService.findById(id);
        if (existingPost != null) {
            var postToUpdate = createHousingPostDto.toHousingPost(existingPost.getOwner());
            var updatedPost = housingPostService.update(id, postToUpdate);
            return Optional.of(DisplayHousingPostDto.from(updatedPost));
        }
        return Optional.empty();
    }

    @Override
    public void deleteById(Long id) {
        housingPostService.delete(id);
    }

    @Override
    public List<DisplayHousingPostDto> findByMunicipality(String municipality) {
        return housingPostService.findByMunicipality(municipality).stream()
                .map(DisplayHousingPostDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getAllMunicipalities() {
        return housingPostService.getAllMunicipalities();
    }
}