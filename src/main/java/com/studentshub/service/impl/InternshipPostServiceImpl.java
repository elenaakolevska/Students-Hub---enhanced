package com.studentshub.service.impl;

import com.studentshub.model.InternshipPost;
import com.studentshub.model.User;
import com.studentshub.model.exceptions.PostNotFoundException;
import com.studentshub.model.exceptions.ResourceNotFoundException;
import com.studentshub.repository.InternshipPostRepository;
import com.studentshub.service.InternshipPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InternshipPostServiceImpl implements InternshipPostService {

    private final InternshipPostRepository repository;
    private final UserService userService;

    public InternshipPostServiceImpl(InternshipPostRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    @Override
    public InternshipPost create(InternshipPost post,String username) {
        User owner = userService.getUserByUsername(username);
        InternshipPost newPost = new InternshipPost();
        newPost.setCompany(post.getCompany());
        newPost.setFacultyFilter(post.getFacultyFilter());
        newPost.setPosition(post.getPosition());
        newPost.setLogoUrl(post.getLogoUrl());
        newPost.setDescription(post.getDescription());
        newPost.setTitle(post.getTitle());
        newPost.setOwner(owner);
        newPost.setCreatedAt(LocalDateTime.now());

        return repository.save(newPost);
    }

    @Override
    public InternshipPost findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new PostNotFoundException(id));
    }

    @Override
    public List<InternshipPost> findAll() {
        return repository.findAll();
    }

    @Override
    public InternshipPost update(Long id, InternshipPost updatedPost) {
        InternshipPost existingPost = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("InternshipPost not found with id: " + id));

        existingPost.setCompany(updatedPost.getCompany());
        existingPost.setFacultyFilter(updatedPost.getFacultyFilter());
        existingPost.setPosition(updatedPost.getPosition());
        existingPost.setLogoUrl(updatedPost.getLogoUrl());
        existingPost.setDescription(updatedPost.getDescription());
        existingPost.setTitle(updatedPost.getTitle());

        return repository.save(existingPost);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<InternshipPost> findByFacultyFilter(String facultyFilter) {
        return repository.findByFacultyFilterIgnoreCase(facultyFilter);
    }

}
