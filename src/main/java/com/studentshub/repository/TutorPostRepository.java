package com.studentshub.repository;

import com.studentshub.model.EventPost;
import com.studentshub.model.TutorPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TutorPostRepository extends JpaRepository<TutorPost, Long>, JpaSpecificationExecutor<TutorPost> {
    List<TutorPost> findByTutorNameContainingIgnoreCaseAndSubjectContainingIgnoreCase(String tutorName, String subject);

    List<TutorPost> findByTutorNameContainingIgnoreCase(String tutorName);

    List<TutorPost> findBySubjectContainingIgnoreCase(String subject);
}

