package com.rainbowforest.productcatalogservice.service;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Pageable;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.LoggerFactory;

import org.springframework.http.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import org.slf4j.Logger;

import jakarta.persistence.criteria.Predicate;

@Service
@Transactional

public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private FileService fileService;

    @Value("${project.image}")
    private String path;

    @Value("${clarifai.api.key}")
    private String clarifaiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final Logger log = LoggerFactory.getLogger(ProductServiceImpl.class);

    public float[] extractImageVector(byte[] imageBytes) {
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        String url = "https://api.clarifai.com/v2/models/general-image-recognition/versions/aa7f35c01e0642fda5cf400f543e7c40/outputs";

        String requestBody = String.format("""
                {
                  "inputs": [
                    {
                      "data": {
                        "image": {
                          "base64": "%s"
                        }
                      }
                    }
                  ]
                }
                """, base64Image);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        if (clarifaiApiKey == null || clarifaiApiKey.isEmpty()) {
            throw new IllegalStateException("clarifai.api.key is not set");
        }
        headers.setBearerAuth(clarifaiApiKey);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            JSONObject json = new JSONObject(response.getBody());
            JSONArray vector = json.getJSONArray("outputs")
                    .getJSONObject(0)
                    .getJSONObject("data")
                    .getJSONArray("embeddings")
                    .getJSONObject(0)
                    .getJSONArray("vector");

            float[] result = new float[vector.length()];
            for (int i = 0; i < vector.length(); i++) {
                result[i] = vector.getNumber(i).floatValue();
            }
            return result;

        } catch (HttpClientErrorException e) {
            log.error("HTTP error when calling external API: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Failed to call image vector API", e);
        } catch (Exception e) {
            log.error("Unexpected error when calling external API: {}", e.getMessage(), e);
            throw new RuntimeException("Unexpected error", e);
        }
    }

    @Override
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getAllProductByCategory(String category) {
        return productRepository.findAllByCategory(category);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public List<Product> getAllProductsByName(String name) {
        return productRepository.findByProductNameContainingIgnoreCase(name);
    }

    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    @Override
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public List<Product> filterProducts(
            String keyword,
            String category,
            Double minPrice,
            Double maxPrice,
            String sortBy,
            String direction) {

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("productName")), "%" + keyword.toLowerCase() + "%"));
            }
            if (category != null && !category.isEmpty()) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<String> validSortFields = List.of("price", "productName", "createdAt");

        if (sortBy == null || !validSortFields.contains(sortBy)) {
            sortBy = "price";
        }

        if (direction == null || (!direction.equalsIgnoreCase("asc") && !direction.equalsIgnoreCase("desc"))) {
            direction = "asc";
        }

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(Sort.Direction.ASC, sortBy)
                : Sort.by(Sort.Direction.DESC, sortBy);

        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE, sort);

        return productRepository.findAll(spec, pageable).getContent();
    }

    @Override
    public Product updateProductImage(Long productId, MultipartFile image) throws IOException {
        Product productFromDB = productRepository.findById(productId)
                .orElseThrow();

        System.out.println("Product: " + productFromDB);

        String fileName = fileService.uploadImage(path, image);
        System.out.println("file naeme:" + fileName);
        if (fileName == null) {
            throw new IOException("File name is null.");
        }

        productFromDB.setImageUrl(fileName);

        Product updatedProduct = productRepository.save(productFromDB);
        return updatedProduct;
    }

    // @Override
    // public List<Product> searchProductsByKeyword(String keyword) {
    // return
    // productRepository.findByNameContainingIgnoreCaseOrTypeContainingIgnoreCase(keyword,
    // keyword);
    // }

}
