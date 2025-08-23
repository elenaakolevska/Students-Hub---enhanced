package com.studentshub.repository;


import com.studentshub.model.EventPost;
import com.studentshub.model.GroupChat;
import com.studentshub.model.Message;
import com.studentshub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long>, JpaSpecificationExecutor<Message> {
    List<Message> findBySenderOrReceiver(User sender, User receiver);
    List<Message> findByGroup(GroupChat group);

    @Query("SELECT m FROM Message m WHERE (m.sender = :u1 AND m.receiver = :u2) OR (m.sender = :u2 AND m.receiver = :u1) ORDER BY m.timestamp")
    List<Message> findChatBetweenUsers(@Param("u1") User u1, @Param("u2") User u2);

//    @Query("SELECT DISTINCT CASE WHEN m.sender = :user THEN m.receiver ELSE m.sender END FROM Message m WHERE m.sender = :user OR m.receiver = :user")
//    List<User> findChatPartners(@Param("user") User user);

    @Query("SELECT DISTINCT m.receiver FROM Message m WHERE m.sender = :user")
    List<User> findReceiversBySender(@Param("user") User user);

    @Query("SELECT DISTINCT m.sender FROM Message m WHERE m.receiver = :user")
    List<User> findSendersByReceiver(@Param("user") User user);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.sender = :sender AND m.receiver = :receiver AND m.read = false")
    long countUnreadMessages(@Param("sender") User sender, @Param("receiver") User receiver);
}