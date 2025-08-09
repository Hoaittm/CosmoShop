package com.rainbowforest.discountservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rainbowforest.discountservice.entity.UserCoupon;

@Repository
public interface UserCouponRepository extends JpaRepository<UserCoupon, Long> {

    Optional<UserCoupon> findByUserIdAndCode(Long userId, String code);

    List<UserCoupon> findAllByUserId(Long userId);

    void deleteByUserIdAndCode(Long userId, String code);
    // Optional<UserCoupon> findByUserIdAndCode(Long userId, String code);

}