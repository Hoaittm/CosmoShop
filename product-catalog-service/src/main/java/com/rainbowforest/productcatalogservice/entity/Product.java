package com.rainbowforest.productcatalogservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Date;

@Entity
@Table(name = "products")
@Data
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "product_name")
	@Nonnull
	private String productName;

	@Column(name = "price")
	@Nonnull
	private BigDecimal price;

	@Column(name = "priceSale")
	@Nonnull
	private BigDecimal priceSale;
	@Column(name = "discription")
	private String discription;

	@Column(name = "category")
	@Nonnull
	private String category;

	@Column(name = "availability")
	@Nonnull
	private int availability;

	@Column(name = "image_url")
	private String imageUrl; // Thêm trường hình ảnh
	@Column(columnDefinition = "float8[]")
	private float[] imageVector;
	@Column
	private Date createdAt;

	public Product() {
	}

	// Getters & Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public String getDiscription() {
		return discription;
	}

	public void setDiscription(String discription) {
		this.discription = discription;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public int getAvailability() {
		return availability;
	}

	public void setAvailability(int availability) {
		this.availability = availability;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public float[] getImageVector() {
		return imageVector;
	}

	public void setImageVector(float[] imageVector) {
		this.imageVector = imageVector;
	}

}
