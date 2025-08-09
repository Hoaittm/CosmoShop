package com.rainbowforest.productcatalogservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.rainbowforest.productcatalogservice.entity.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    public List<Product> findAllByCategory(String category);

    public List<Product> findByProductNameContainingIgnoreCase(String name);

    // List<Product> findByNameContainingIgnoreCaseOrTypeContainingIgnoreCase(String
    // name, String type);

    // List<Product> findTop5ByProductNameContainingIgnoreCase(String name);
}
