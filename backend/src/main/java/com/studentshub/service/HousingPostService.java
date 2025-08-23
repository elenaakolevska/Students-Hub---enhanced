package com.studentshub.service;

import com.studentshub.model.HousingPost;

import java.util.List;

public interface HousingPostService {

    HousingPost findById(Long id);
    List<HousingPost> findAll();
    HousingPost update(Long id, HousingPost post);
    void delete(Long id);
    List<HousingPost> findByMunicipality(String municipality);
    List<String> getAllMunicipalities();
    HousingPost create(HousingPost post, String username);
}

