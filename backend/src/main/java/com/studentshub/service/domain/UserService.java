package com.studentshub.service.domain;

import com.studentshub.model.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

public interface UserService extends UserDetailsService
{
    List<User> findAll();
    User createUser(User user);
    User getUserById(Long id);
    User getUserByUsername(String username);
    User updateUser(User user);
    void deleteUser(Long id);
    User getCurrentUser();
    
    @Override
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}

