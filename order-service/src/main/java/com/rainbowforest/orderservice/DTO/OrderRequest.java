package com.rainbowforest.orderservice.DTO;

import java.util.List;

import com.rainbowforest.orderservice.domain.Item;

public class OrderRequest {
    private List<Item> items;
    private String code;
    private Long userId;

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
