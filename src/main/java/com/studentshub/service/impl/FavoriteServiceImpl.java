package com.studentshub.service.impl;

import com.studentshub.model.Favorite;
import com.studentshub.model.Post;
import com.studentshub.model.User;
import com.studentshub.repository.FavoriteRepository;
import com.studentshub.service.FavoriteService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public FavoriteServiceImpl(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    @Override
    public Favorite addFavorite(User user, Post post) {
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setPost(post);
        favorite.setCreatedAt(LocalDateTime.now());
        return favoriteRepository.save(favorite);
    }

    @Override
    public List<Favorite> getFavoritesByUser(User user) {
        return favoriteRepository.findByUser(user);
    }

    @Override
    public void removeFavorite(Long favoriteId) {
        favoriteRepository.deleteById(favoriteId);
    }

    @Override
    public void deleteAllByPostId(Long postId) {
        favoriteRepository.deleteAllByPostId(postId);
    }

}

