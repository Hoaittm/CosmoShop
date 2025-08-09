package com.rainbowforest.orderservice.DTO;

import java.io.Serializable;

public class DiscountDTO implements Serializable {

    private String code;
    private String discountType;
    private double discountValue;

    public DiscountDTO() {
    }

    public DiscountDTO(String code, String discount_type, double discount_value) {
        this.code = code;
        this.discountType = discount_type;
        this.discountValue = discount_value;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discount_type) {
        this.discountType = discount_type;
    }

    public double getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(double discount_value) {
        this.discountValue = discount_value;
    }
}
