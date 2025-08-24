package com.studentshub.service.application;

import com.studentshub.dto.create.CreateTransportPostDto;
import com.studentshub.dto.display.DisplayTransportPostDto;
import java.util.List;
import java.util.Optional;

public interface TransportPostApplicationService {
    Optional<DisplayTransportPostDto> save(CreateTransportPostDto createTransportPostDto, String username);
    Optional<DisplayTransportPostDto> findById(Long id);
    List<DisplayTransportPostDto> findAll();
    Optional<DisplayTransportPostDto> update(Long id, CreateTransportPostDto createTransportPostDto);
    void deleteById(Long id);
    List<DisplayTransportPostDto> findByLocationFromAndLocationTo(String locationFrom, String locationTo);
}