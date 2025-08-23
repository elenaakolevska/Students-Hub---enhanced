package com.studentshub.repository;

import com.studentshub.model.EventPost;
import com.studentshub.model.TransportPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportPostRepository extends JpaRepository<TransportPost, Long>, JpaSpecificationExecutor<TransportPost> {
    List<TransportPost> findByLocationFromContainingIgnoreCaseAndLocationToContainingIgnoreCase(String locationFrom, String locationTo);
    List<TransportPost> findByLocationFromContainingIgnoreCase(String locationFrom);
    List<TransportPost> findByLocationToContainingIgnoreCase(String locationTo);


}
