package com.studentshub.service;

import com.studentshub.model.User;

import java.util.List;

public interface UserService
{
    List<User> findAll();
    User createUser(User user);
    User getUserById(Long id);
    User getUserByUsername(String username);
    User updateUser(User user);
    void deleteUser(Long id);
    User getCurrentUser();
}

