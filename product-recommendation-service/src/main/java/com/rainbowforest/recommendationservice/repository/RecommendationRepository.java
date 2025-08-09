package com.rainbowforest.recommendationservice.repository;

import com.rainbowforest.recommendationservice.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    @Query("SELECT r FROM Recommendation r WHERE LOWER(r.product.productName) LIKE LOWER(CONCAT('%', :productName, '%'))")
    public List<Recommendation> findAllRatingByProductName(@Param("productName") String productName);
}
