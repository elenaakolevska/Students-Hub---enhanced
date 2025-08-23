package com.studentshub.service;

import com.studentshub.model.Favorite;
import com.studentshub.model.Post;
import com.studentshub.model.User;

import java.util.List;

public interface FavoriteService {
    Favorite addFavorite(User user, Post post);
    List<Favorite> getFavoritesByUser(User user);
    void removeFavorite(Long favoriteId);
    void deleteAllByPostId(Long postId);

}

