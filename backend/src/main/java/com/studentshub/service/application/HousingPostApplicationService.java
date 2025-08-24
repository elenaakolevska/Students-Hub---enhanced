package com.studentshub.service.application;

import com.studentshub.dto.create.CreateHousingPostDto;
import com.studentshub.dto.display.DisplayHousingPostDto;
import java.util.List;
import java.util.Optional;

public interface HousingPostApplicationService {
    Optional<DisplayHousingPostDto> findById(Long id);
    List<DisplayHousingPostDto> findAll();
    Optional<DisplayHousingPostDto> save(CreateHousingPostDto createHousingPostDto, String username);
    Optional<DisplayHousingPostDto> update(Long id, CreateHousingPostDto createHousingPostDto);
    void deleteById(Long id);
    List<DisplayHousingPostDto> findByMunicipality(String municipality);
    List<String> getAllMunicipalities();
}