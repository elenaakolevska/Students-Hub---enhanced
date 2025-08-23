package com.studentshub.repository;

import com.studentshub.model.EventPost;
import com.studentshub.model.InternshipPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipPostRepository extends JpaRepository<InternshipPost, Long>, JpaSpecificationExecutor<InternshipPost> {
    List<InternshipPost> findByFacultyFilterIgnoreCase(String facultyFilter);

}

