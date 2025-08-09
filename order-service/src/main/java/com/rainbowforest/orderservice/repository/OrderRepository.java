package com.rainbowforest.orderservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rainbowforest.orderservice.domain.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_UserName(String userName);

    @EntityGraph(attributePaths = "user")
    Optional<Order> findByIdAndUser_UserName(Long id, String userName);
}
