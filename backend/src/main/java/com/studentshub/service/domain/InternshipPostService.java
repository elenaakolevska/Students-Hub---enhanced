package com.studentshub.service.domain;


import com.studentshub.model.InternshipPost;

import java.util.List;

public interface InternshipPostService {
    InternshipPost create(InternshipPost post, String username);
    InternshipPost findById(Long id);
    List<InternshipPost> findAll();
    InternshipPost update(Long id, InternshipPost post);
    void delete(Long id);
    List<InternshipPost> findByFacultyFilter(String facultyFilter);

}

