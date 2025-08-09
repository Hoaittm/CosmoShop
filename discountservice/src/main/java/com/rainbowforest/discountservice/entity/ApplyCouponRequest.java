package com.rainbowforest.discountservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "applyCouponRequest")
@Data
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class ApplyCouponRequest {
    @Id
    @GeneratedValue
    private Long id;
    private Long userId;
    private String code;
    private double totalAmount;
}
