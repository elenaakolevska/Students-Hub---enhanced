package com.studentshub.service.impl;

import com.studentshub.model.TransportPost;
import com.studentshub.model.User;
import com.studentshub.model.exceptions.PostNotFoundException;
import com.studentshub.model.exceptions.ResourceNotFoundException;
import com.studentshub.repository.TransportPostRepository;
import com.studentshub.service.TransportPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransportPostImpl implements TransportPostService {

    private final TransportPostRepository repository;
    private final UserService userService;

    public TransportPostImpl(TransportPostRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    @Override
    public TransportPost create(TransportPost post, String username) {
        User owner = userService.getUserByUsername(username);

        TransportPost newPost = new TransportPost();
        newPost.setDepartureDatetime(post.getDepartureDatetime());
        newPost.setProviderName(post.getProviderName());
        newPost.setLocationFrom(post.getLocationFrom());
        newPost.setLocationTo(post.getLocationTo());
        newPost.setPrice(post.getPrice());

        newPost.setTitle(post.getTitle());
        newPost.setDescription(post.getDescription());
        newPost.setCategory(post.getCategory());

        newPost.setOwner(owner);
        newPost.setCreatedAt(LocalDateTime.now());

        return repository.save(newPost);
    }

    @Override
    public TransportPost findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(id));
    }

    @Override
    public List<TransportPost> findAll() {
        return repository.findAll();
    }

    @Override
    public TransportPost update(Long id, TransportPost updatedPost) {
        TransportPost existingPost = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TransportPost not found with id: " + id));

        existingPost.setDepartureDatetime(updatedPost.getDepartureDatetime());
        existingPost.setProviderName(updatedPost.getProviderName());
        existingPost.setLocationFrom(updatedPost.getLocationFrom());
        existingPost.setLocationTo(updatedPost.getLocationTo());
        existingPost.setPrice(updatedPost.getPrice());

        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setDescription(updatedPost.getDescription());
        existingPost.setCategory(updatedPost.getCategory());

        return repository.save(existingPost);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<TransportPost> findByLocationFromAndLocationTo(String locationFrom, String locationTo) {
        if ((locationFrom == null || locationFrom.isEmpty()) && (locationTo == null || locationTo.isEmpty())) {
            return repository.findAll();
        }
        else if (locationFrom == null || locationFrom.isEmpty()) {
            return repository.findByLocationToContainingIgnoreCase(locationTo);
        }
        else if (locationTo == null || locationTo.isEmpty()) {
            return repository.findByLocationFromContainingIgnoreCase(locationFrom);
        }
        else {
            return repository.findByLocationFromContainingIgnoreCaseAndLocationToContainingIgnoreCase(locationFrom, locationTo);
        }
    }

}
