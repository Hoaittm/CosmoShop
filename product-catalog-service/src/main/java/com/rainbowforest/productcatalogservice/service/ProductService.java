package com.rainbowforest.productcatalogservice.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.rainbowforest.productcatalogservice.entity.Product;

public interface ProductService {
    public List<Product> getAllProduct();

    public List<Product> getAllProductByCategory(String category);

    public Product getProductById(Long id);

    public List<Product> getAllProductsByName(String name);

    public Product addProduct(Product product);

    public void deleteProduct(Long productId);

    public Product updateProductImage(Long productId, MultipartFile image) throws IOException;

    public float[] extractImageVector(byte[] imageBytes);

    public List<Product> filterProducts(String keyword,
            String category,
            Double minPrice,
            Double maxPrice,
            String sortBy, // VD: "price", "productName", "createdAt"
            String direction // "asc" hoặc "desc"
    );

    public Product updateProduct(Product product);
    // List<Product> searchProductsByKeyword(String keyword);

}
