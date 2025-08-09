package com.rainbowforest.orderservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.rainbowforest.orderservice.DTO.DiscountDTO;

@FeignClient(
    name = "discounts",
    url = "http://localhost:8815/api/discount")
public interface DiscountClient {
    @GetMapping("/coupon")
    DiscountDTO applyCoupon(@RequestParam("code") String discountCode);
}
