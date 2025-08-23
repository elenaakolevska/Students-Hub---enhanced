package com.studentshub.service.impl;
import com.studentshub.model.HousingPost;
import com.studentshub.model.User;
import com.studentshub.model.exceptions.PostNotFoundException;
import com.studentshub.model.exceptions.ResourceNotFoundException;
import com.studentshub.repository.HousingPostRepository;
import com.studentshub.service.HousingPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HousingPostServiceImpl implements HousingPostService {

    private final HousingPostRepository repository;
    private final UserService userService;

    public HousingPostServiceImpl(HousingPostRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    @Override
    public HousingPost create(HousingPost post, String username
    ) {

        User owner = userService.getUserByUsername(username);

        HousingPost newPost = new HousingPost();
        newPost.setMunicipality(post.getMunicipality());
        newPost.setDescription(post.getDescription());
        newPost.setTitle(post.getTitle());
        newPost.setLocation(post.getLocation());
        newPost.setPrice(post.getPrice());
        newPost.setImages(post.getImages());
        newPost.setFound(post.isFound());
        newPost.setTags(post.getTags());

        newPost.setOwner(owner);
        newPost.setCreatedAt(LocalDateTime.now());

        return repository.save(newPost);
    }

    @Override
    public HousingPost findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new PostNotFoundException(id));
    }

    @Override
    public List<HousingPost> findAll() {
        return repository.findAll();
    }

    @Override
    public HousingPost update(Long id, HousingPost updatedPost) {
        HousingPost existingPost = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HousingPost not found with id: " + id));

        existingPost.setMunicipality(updatedPost.getMunicipality());
        existingPost.setLocation(updatedPost.getLocation());
        existingPost.setPrice(updatedPost.getPrice());
        existingPost.setImages(updatedPost.getImages());
        existingPost.setFound(updatedPost.isFound());
        existingPost.setTags(updatedPost.getTags());
        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setDescription(updatedPost.getDescription());

        return repository.save(existingPost);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<HousingPost> findByMunicipality(String municipality) {
        return repository.findByMunicipality(municipality);
    }

    @Override
    public List<String> getAllMunicipalities() {
        return repository.findAllByOrderByMunicipalityAsc()
                .stream()
                .map(HousingPost::getMunicipality)
                .distinct()
                .toList();
    }

}
