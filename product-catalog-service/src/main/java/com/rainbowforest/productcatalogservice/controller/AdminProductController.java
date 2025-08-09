package com.rainbowforest.productcatalogservice.controller;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.http.header.HeaderGenerator;
import com.rainbowforest.productcatalogservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/catalog/admin")

public class AdminProductController {

	@Autowired
	private ProductService productService;

	@Autowired
	private HeaderGenerator headerGenerator;

	@PostMapping(value = "/products")
	private ResponseEntity<Product> addProduct(@RequestBody Product product, HttpServletRequest request) {
		if (product != null) {
			try {
				productService.addProduct(product);
				return new ResponseEntity<Product>(
						product,
						headerGenerator.getHeadersForSuccessPostMethod(request, product.getId()),
						HttpStatus.CREATED);
			} catch (Exception e) {
				e.printStackTrace();
				return new ResponseEntity<Product>(
						headerGenerator.getHeadersForError(),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		return new ResponseEntity<Product>(
				headerGenerator.getHeadersForError(),
				HttpStatus.BAD_REQUEST);
	}

	@PostMapping("/products/{productId}/image")
	public ResponseEntity<Product> updateProductImage(
			@PathVariable Long productId,
			@RequestParam("image") MultipartFile image) throws IOException {
		if (image.isEmpty()) {
			return ResponseEntity.badRequest().build();
		}
		Product updatedProduct = productService.updateProductImage(productId, image);
		return ResponseEntity.ok(updatedProduct);
	}

	@DeleteMapping(value = "/products/{id}")
	private ResponseEntity<Void> deleteProduct(@PathVariable("id") Long id) {
		Product product = productService.getProductById(id);
		if (product != null) {
			try {
				productService.deleteProduct(id);
				return new ResponseEntity<Void>(
						headerGenerator.getHeadersForSuccessGetMethod(),
						HttpStatus.OK);
			} catch (Exception e) {
				e.printStackTrace();
				return new ResponseEntity<Void>(
						headerGenerator.getHeadersForError(),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		return new ResponseEntity<Void>(headerGenerator.getHeadersForError(), HttpStatus.NOT_FOUND);
	}

	@PutMapping(value = "/products/{id}")
	private ResponseEntity<Product> updateProduct(@PathVariable("id") Long id, @RequestBody Product updatedProduct,
			HttpServletRequest request) {
		if (updatedProduct != null) {
			try {
				Product existingProduct = productService.getProductById(id);
				if (existingProduct == null) {
					return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.NOT_FOUND);
				}

				// Cập nhật các trường của sản phẩm
				existingProduct.setProductName(updatedProduct.getProductName());
				existingProduct.setDiscription(updatedProduct.getDiscription());
				existingProduct.setCategory(updatedProduct.getCategory());
				existingProduct.setImageUrl(updatedProduct.getImageUrl());
				existingProduct.setPrice(updatedProduct.getPrice());
				existingProduct.setAvailability(updatedProduct.getAvailability());
				existingProduct.setPriceSale(updatedProduct.getPriceSale());
				productService.updateProduct(existingProduct);

				return new ResponseEntity<>(
						existingProduct,
						headerGenerator.getHeadersForSuccessGetMethod(),
						HttpStatus.OK);
			} catch (Exception e) {
				e.printStackTrace();
				return new ResponseEntity<>(
						headerGenerator.getHeadersForError(),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
		return new ResponseEntity<>(
				headerGenerator.getHeadersForError(),
				HttpStatus.BAD_REQUEST);
	}

}
