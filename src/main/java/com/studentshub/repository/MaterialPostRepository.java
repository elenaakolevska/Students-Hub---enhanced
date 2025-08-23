package com.studentshub.repository;

import com.studentshub.model.EventPost;
import com.studentshub.model.MaterialPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialPostRepository extends JpaRepository<MaterialPost, Long>, JpaSpecificationExecutor<MaterialPost> {
    List<MaterialPost> findBySubjectContainingIgnoreCase(String subject);
    @Query("SELECT DISTINCT m.subject FROM MaterialPost m")
    List<String> findDistinctSubjects();
}

