package com.studentshub.repository;


import com.studentshub.model.EventPost;
import com.studentshub.model.enumerations.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventPostRepository extends JpaRepository<EventPost, Long>, JpaSpecificationExecutor<EventPost> {
    List<EventPost> findByEventCategory(EventCategory eventCategory);
}

