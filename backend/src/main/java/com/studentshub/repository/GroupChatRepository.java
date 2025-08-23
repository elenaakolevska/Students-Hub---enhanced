package com.studentshub.repository;

import com.studentshub.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupChatRepository extends JpaRepository<GroupChat, Long>, JpaSpecificationExecutor<GroupChat> {
    List<GroupChat> findByCreatedBy(User creator);
}