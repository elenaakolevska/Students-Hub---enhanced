package com.studentshub.service;

import com.studentshub.model.MaterialPost;

import java.util.List;

public interface MaterialPostService {
    MaterialPost create(MaterialPost post, String username);
    MaterialPost findById(Long id);
    List<MaterialPost> findAll();
    MaterialPost update(Long id, MaterialPost post);
    void delete(Long id);
    List<MaterialPost> findBySubject(String subject);
    List<String> findAllSubjects();

}
