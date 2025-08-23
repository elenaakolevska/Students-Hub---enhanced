package com.studentshub.service.impl;

import com.studentshub.model.TutorPost;
import com.studentshub.model.User;
import com.studentshub.model.exceptions.PostNotFoundException;
import com.studentshub.repository.TutorPostRepository;
import com.studentshub.service.TutorPostService;
import com.studentshub.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TutorPostServiceImpl implements TutorPostService {

    private final TutorPostRepository repository;
    private final UserService userService;

    public TutorPostServiceImpl(TutorPostRepository repository, UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    @Override
    public TutorPost create(TutorPost post, String username) {

        User owner = userService.getUserByUsername(username);

        TutorPost newPost = new TutorPost();
        newPost.setTitle(post.getTitle());
        newPost.setDescription(post.getDescription());
        newPost.setSubject(post.getSubject());
        newPost.setTutor(owner);
        newPost.setTutorName(post.getTutorName());
        newPost.setFaculty(post.getFaculty());
        newPost.setWorksOnline(post.isWorksOnline());
        newPost.setPrice(post.getPrice());

        newPost.setOwner(owner);
        newPost.setCreatedAt(LocalDateTime.now());

        return repository.save(newPost);
    }


    @Override
    public TutorPost findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new PostNotFoundException(id));
    }

    @Override
    public List<TutorPost> findAll() {
        return repository.findAll();
    }

    @Override
    public TutorPost update(Long id, TutorPost updatedPost) {
        TutorPost existingPost = repository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(id));

        existingPost.setTutorName(updatedPost.getTutorName());
        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setDescription(updatedPost.getDescription());
        existingPost.setSubject(updatedPost.getSubject());
        existingPost.setTutor(updatedPost.getTutor());
        existingPost.setFaculty(updatedPost.getFaculty());
        existingPost.setWorksOnline(updatedPost.isWorksOnline());
        existingPost.setPrice(updatedPost.getPrice());

        return repository.save(existingPost);
    }


    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<TutorPost> findByTutorNameAndSubject(String tutorName, String subject) {
        boolean tutorNameEmpty = (tutorName == null || tutorName.isEmpty());
        boolean subjectEmpty = (subject == null || subject.isEmpty());

        if (!tutorNameEmpty && !subjectEmpty) {
            return repository.findByTutorNameContainingIgnoreCaseAndSubjectContainingIgnoreCase(tutorName, subject);
        } else if (!tutorNameEmpty) {
            return repository.findByTutorNameContainingIgnoreCase(tutorName);
        } else if (!subjectEmpty) {
            return repository.findBySubjectContainingIgnoreCase(subject);
        } else {
            return repository.findAll();
        }
    }

}
