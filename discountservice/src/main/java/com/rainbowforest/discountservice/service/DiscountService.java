package com.rainbowforest.discountservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.rainbowforest.discountservice.entity.Discount;
import com.rainbowforest.discountservice.entity.UserCoupon;
import com.rainbowforest.discountservice.feignClient.UserClient;
import com.rainbowforest.discountservice.repository.DiscountRepository;
import com.rainbowforest.discountservice.repository.UserCouponRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DiscountService {
    private final DiscountRepository discountRepository;
    private final UserCouponRepository userCouponRepository;
    @Autowired
    private UserClient userClient;

    public DiscountService(DiscountRepository discountRepository, UserCouponRepository userCouponRepository) {
        this.discountRepository = discountRepository;
        this.userCouponRepository = userCouponRepository;
    }

    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    public Discount createTemplate(Discount dto) {
        Discount template = new Discount();
        template.setCode(dto.getCode());
        template.setDiscountType(dto.getDiscountType());
        template.setDiscountValue(dto.getDiscountValue());
        template.setEndDate(dto.getEndDate());
        template.setMinOrderValue(dto.getMinOrderValue());
        template.setStartDate(dto.getStartDate());

        return discountRepository.save(template);
    }

    public Optional<Discount> applyDiscount(String code) {
        Optional<Discount> discountOpt = discountRepository.findByCode(code);

        if (discountOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mã giảm giá không tồn tại!");
        }

        Discount discount = discountOpt.get();

        // Kiểm tra điều kiện
        if (!discount.getIsActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã hết hiệu lực!");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(discount.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá chưa có hiệu lực!");
        }

        if (now.isAfter(discount.getEndDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã hết hạn!");
        }

        return discountOpt;
    }

    public UserCoupon distributeCoupon(Long userId, String code) {
        // Gọi sang UserService để xác minh user tồn tại
        UserCoupon user = userClient.getUserById(userId);
        if (user == null || user.getId() == null) {
            throw new RuntimeException("Người dùng không tồn tại");
        }

        // Kiểm tra mã giảm giá
        Discount template = discountRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã"));

        if (template.getEndDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã đã hết hạn");
        }

        // Gán và lưu coupon cho user
        UserCoupon userCoupon = new UserCoupon();
        userCoupon.setUserId(userId);
        userCoupon.setCode(code);
        return userCouponRepository.save(userCoupon);
    }

    public boolean deleteDiscountById(Long id) {
        Optional<Discount> discountOpt = discountRepository.findById(id);
        if (discountOpt.isPresent()) {
            discountRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void deleteCouponByUserIdAndCode(Long userId, String code) {
        userCouponRepository.deleteByUserIdAndCode(userId, code);
    }

    public double applyCoupon(Long userId, String code, double totalAmount) {
        // Lấy coupon đã phân phối cho user

        Optional<UserCoupon> optionalCoupon = userCouponRepository.findByUserIdAndCode(userId, code);
        if (!optionalCoupon.isPresent()) {
            throw new RuntimeException("Không tìm thấy mã cho user");
        }
        UserCoupon userCoupon = optionalCoupon.get();
        // Kiểm tra coupon đã được sử dụng chưa
        if (userCoupon.isUsed()) {
            throw new RuntimeException("Mã đã sử dụng");
        }

        // Lấy mẫu coupon template
        Discount template = discountRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mẫu mã"));

        // Kiểm tra hết hạn
        if (template.getEndDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã đã hết hạn");
        }

        // Đánh dấu coupon đã sử dụng
        userCoupon.setUsed(true);
        userCouponRepository.save(userCoupon);

        // Tính giá sau giảm theo phần trăm
        double discountPercent = template.getDiscountValue();
        double discountedAmount = totalAmount * (1 - discountPercent / 100.0);

        // Trả về tổng tiền sau khi áp dụng mã giảm giá
        return discountedAmount;
    }

    public void deleteUserCoupon(Long userId, String code) {
        Optional<UserCoupon> userCouponOpt = userCouponRepository.findByUserIdAndCode(userId, code);
        if (userCouponOpt.isEmpty()) {
            throw new RuntimeException("Không tìm thấy mã giảm giá cho người dùng");
        }

        userCouponRepository.delete(userCouponOpt.get());
    }

    public List<Discount> getUserDiscounts(Long userId) {
        List<UserCoupon> userCoupons = userCouponRepository.findAllByUserId(userId);

        return userCoupons.stream()
                .map(UserCoupon::getCode)
                .map(discountRepository::findByCode)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }
}