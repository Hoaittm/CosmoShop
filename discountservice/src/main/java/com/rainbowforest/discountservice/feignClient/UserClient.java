package com.rainbowforest.discountservice.feignClient;

import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.rainbowforest.discountservice.entity.UserCoupon;

@FeignClient(name = "user-service", url = "http://localhost:8811/api/accounts")
public interface UserClient {

    @GetMapping(value = "/users/{id}")
    UserCoupon getUserById(@PathVariable("id") Long id);
}
