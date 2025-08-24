package com.studentshub.service.domain;
import com.studentshub.model.Favorite;
import com.studentshub.model.Post;
import com.studentshub.model.User;
import java.util.List;
import java.util.Optional;

public interface FavoriteService {
    Favorite addFavorite(User user, Post post);
    List<Favorite> getFavoritesByUser(User user);
    void removeFavorite(Long favoriteId);
    void deleteAllByPostId(Long postId);
    List<Favorite> findAll();
    Optional<Favorite> findById(Long id);
    Favorite save(Favorite favorite);
    Optional<Favorite> update(Long id, Favorite favorite);
    Optional<Favorite> deleteById(Long id);
}
