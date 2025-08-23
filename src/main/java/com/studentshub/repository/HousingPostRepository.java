package com.studentshub.repository;

import com.studentshub.model.EventPost;
import com.studentshub.model.HousingPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HousingPostRepository extends JpaRepository<HousingPost, Long>, JpaSpecificationExecutor<HousingPost> {
    List<HousingPost> findByMunicipality(String municipality);

    List<HousingPost> findAllByOrderByMunicipalityAsc();

}

