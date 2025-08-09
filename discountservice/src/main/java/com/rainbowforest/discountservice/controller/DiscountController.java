package com.rainbowforest.discountservice.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.rainbowforest.discountservice.entity.ApplyCouponRequest;
import com.rainbowforest.discountservice.entity.Discount;
import com.rainbowforest.discountservice.entity.UserCoupon;
import com.rainbowforest.discountservice.http.header.HeaderGenerator;
import com.rainbowforest.discountservice.service.DiscountService;

@RestController
@RequestMapping("/api/discount")
public class DiscountController {

    @Autowired
    private HeaderGenerator headerGenerator;

    @Autowired
    private final DiscountService discountService;

    public DiscountController(DiscountService discountService, HeaderGenerator headerGenerator) {
        this.discountService = discountService;
        this.headerGenerator = headerGenerator;
    }

    @PostMapping("/template")
    public ResponseEntity<?> createTemplate(@RequestBody Discount dto) {
        return ResponseEntity.ok(discountService.createTemplate(dto));
    }

    @PostMapping("/distribute")
    public ResponseEntity<?> distribute(@RequestBody UserCoupon req) {
        return ResponseEntity.ok(discountService.distributeCoupon(req.getUserId(), req.getCode()));
    }

    @DeleteMapping("/user-coupons/{userId}/{code}")
    public ResponseEntity<?> deleteUserCoupon(@PathVariable Long userId, @PathVariable String code) {
        discountService.deleteUserCoupon(userId, code);
        return ResponseEntity.ok("Xoá mã giảm giá khỏi người dùng thành công");
    }

    // @DeleteMapping("/distribute")
    // public ResponseEntity<?> deleteUserCoupon(
    // @RequestParam Long userId,
    // @RequestParam String code) {
    // discountService.deleteCouponByUserIdAndCode(userId, code);
    // return ResponseEntity.ok("Deleted coupon with code '" + code + "' for userId:
    // " + userId);
    // }

    @PostMapping("/apply")
    public ResponseEntity<?> applyCoupon(@RequestBody ApplyCouponRequest req) {
        double finalPrice = discountService.applyCoupon(req.getUserId(), req.getCode(), req.getTotalAmount());
        return ResponseEntity.ok(Map.of("finalPrice", finalPrice));
    }

    @GetMapping("/user-coupons/{userId}")
    public ResponseEntity<List<Discount>> getUserDiscounts(@PathVariable Long userId) {
        List<Discount> discounts = discountService.getUserDiscounts(userId);
        return ResponseEntity.ok(discounts);
    }

    @GetMapping(value = "/coupons")
    public ResponseEntity<List<Discount>> getAllDiscounts() {
        List<Discount> discounts = discountService.getAllDiscounts();
        if (!discounts.isEmpty()) {
            return new ResponseEntity<List<Discount>>(
                    discounts,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<List<Discount>>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @DeleteMapping(value = "/coupons/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable("id") Long id) {
        try {
            boolean deleted = discountService.deleteDiscountById(id); // gọi hàm service xóa
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/coupon")
    public ResponseEntity<Discount> getCoupon(
            @RequestParam String code) {
        try {
            Discount discount = discountService.applyDiscount(code)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mã giảm giá không tồn tại"));

            return ResponseEntity.ok(discount);
        } catch (RuntimeException e) {
            // Xử lý các loại exception khác nhau
            if (e.getMessage().contains("hết hiệu lực")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
            } else if (e.getMessage().contains("chưa có hiệu lực")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
            } else if (e.getMessage().contains("hết hạn")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
            }
        }
    }
}