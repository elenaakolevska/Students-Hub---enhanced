package com.studentshub.service.domain.impl;

import com.studentshub.model.Favorite;
import com.studentshub.model.Post;
import com.studentshub.model.User;
import com.studentshub.repository.FavoriteRepository;
import com.studentshub.service.domain.FavoriteService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        favorite.setCreatedAt(java.time.LocalDateTime.now());
        return favoriteRepository.save(favorite);
    }

    @Override
    public List<Favorite> getFavoritesByUser(User user) {
        return favoriteRepository.findByUser(user);
    }

    @Override
    public void removeFavorite(Long id) {
        favoriteRepository.deleteById(id);
    }

    @Override
    public void deleteAllByPostId(Long postId) {
        favoriteRepository.deleteAllByPostId(postId);
    }

    @Override
    public List<Favorite> findAll() {
        return favoriteRepository.findAll();
    }

    @Override
    public Optional<Favorite> findById(Long id) {
        return favoriteRepository.findById(id);
    }

    @Override
    public Favorite save(Favorite favorite) {
        return favoriteRepository.save(favorite);
    }

    @Override
    public Optional<Favorite> update(Long id, Favorite favorite) {
        if (favoriteRepository.existsById(id)) {
            favorite.setId(id);
            return Optional.of(favoriteRepository.save(favorite));
        }
        return Optional.empty();
    }

    @Override
    public Optional<Favorite> deleteById(Long id) {
        Optional<Favorite> fav = favoriteRepository.findById(id);
        fav.ifPresent(f -> favoriteRepository.deleteById(id));
        return fav;
    }
}
