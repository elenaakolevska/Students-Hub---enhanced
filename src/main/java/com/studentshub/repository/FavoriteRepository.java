package com.studentshub.repository;

import com.studentshub.model.*;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long>, JpaSpecificationExecutor<Favorite> {
    List<Favorite> findByUser(User user);
    @Modifying
    @Transactional
    @Query("DELETE FROM Favorite f WHERE f.post.id = :postId")
    void deleteAllByPostId(@Param("postId") Long postId);

}