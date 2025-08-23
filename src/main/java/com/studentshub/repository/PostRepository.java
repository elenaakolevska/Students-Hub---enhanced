package com.studentshub.repository;

import com.studentshub.model.EventPost;
import com.studentshub.model.Post;
import com.studentshub.model.User;
import com.studentshub.model.enumerations.PostCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {
    List<Post> findByOwner(User owner);
    Optional<Post> findTopByCategoryOrderByCreatedAtDesc(PostCategory category);
    List<Post> findAllByOwner(User user);
    List<Post> findTop3ByOrderByCreatedAtDesc();

}

