package com.studentshub.repository;

import com.studentshub.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface GroupChatMembersRepository extends JpaRepository<GroupChatMembers, Long>, JpaSpecificationExecutor<GroupChatMembers> {
    List<GroupChatMembers> findByUser(User user);
}
