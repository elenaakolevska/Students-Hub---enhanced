package com.studentshub.service.application;

import com.studentshub.dto.create.CreateUserDto;
import com.studentshub.dto.display.DisplayUserDto;
import java.util.List;
import java.util.Optional;

public interface UserApplicationService {
    List<DisplayUserDto> findAll();
    Optional<DisplayUserDto> findById(Long id);
    DisplayUserDto save(CreateUserDto dto);
    Optional<DisplayUserDto> update(Long id, CreateUserDto dto);
    Optional<DisplayUserDto> deleteById(Long id);
    Optional<DisplayUserDto> findByUsername(String username);
    Optional<DisplayUserDto> findByEmail(String email);
    Optional<DisplayUserDto> updateProfile(String username, CreateUserDto dto);

    /**
     * Authenticate user by username and password. Returns DisplayUserDto if successful, empty otherwise.
     */
    Optional<DisplayUserDto> authenticate(String username, String password);
}
