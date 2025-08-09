package com.rainbowforest.orderservice.controller;

import com.rainbowforest.orderservice.DTO.DiscountDTO;
import com.rainbowforest.orderservice.DTO.OrderRequest;
import com.rainbowforest.orderservice.domain.Item;
import com.rainbowforest.orderservice.domain.Order;
import com.rainbowforest.orderservice.domain.User;
import com.rainbowforest.orderservice.feignclient.DiscountClient;
import com.rainbowforest.orderservice.feignclient.UserClient;
import com.rainbowforest.orderservice.http.header.HeaderGenerator;
import com.rainbowforest.orderservice.service.CartService;
import com.rainbowforest.orderservice.service.OrderService;
import com.rainbowforest.orderservice.utilities.OrderUtilities;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shop")
public class OrderController {

    @Autowired
    private UserClient userClient;

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;
    @Autowired
    private DiscountClient discountClient;

    @Autowired
    private HeaderGenerator headerGenerator;

    @GetMapping("/order/{userName}")
    public ResponseEntity<List<Order>> getOrdersByUserName(@PathVariable String userName) {
        try {
            List<Order> orders = orderService.getOrdersByUserName(userName);

            if (orders.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/order/{orderId}")
    public ResponseEntity<Void> deleteOrderById(@PathVariable Long orderId) {
        try {
            boolean isDeleted = orderService.deleteOrderById(orderId);
            if (isDeleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 - Xóa thành công
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 - Không tìm thấy order
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 500 - Lỗi server
        }
    }

    @GetMapping("/order")
    public ResponseEntity<List<Order>> getAllUsers() {
        List<Order> orders = orderService.getAll();
        if (!orders.isEmpty()) {
            return new ResponseEntity<List<Order>>(
                    orders,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<List<Order>>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/order/{userName}/{id}")
    public ResponseEntity<Order> getOrderByOrderId(
            @PathVariable String userName,
            @PathVariable Long id) {
        Order order = orderService.getOrderByIdAndUsername(id, userName);
        if (order == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok()
                .headers(headerGenerator.getHeadersForSuccessGetMethod())
                .body(order);
    }

    @PostMapping("/order/{userId}")
    public ResponseEntity<Order> saveOrder(
            @PathVariable("userId") Long userId,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader,
            @RequestBody OrderRequest orderRequest,
            HttpServletRequest request) {

        String cartId = extractCartIdFromCookie(cookieHeader);
        if (cartId == null || cartId.isEmpty()) {
            return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.BAD_REQUEST);
        }

        List<Item> cart = cartService.getAllItemsFromCart(cartId);
        User user = userClient.getUserById(userId);

        if (cart != null && !cart.isEmpty() && user != null) {
            try {
                Order order = this.createOrder(cart, user, orderRequest);
                orderService.saveOrder(order);
                cartService.deleteCart(cartId);
                return new ResponseEntity<>(
                        order,
                        headerGenerator.getHeadersForSuccessPostMethodForOrder(request, String.valueOf(order.getId())),
                        HttpStatus.CREATED);
            } catch (Exception ex) {
                ex.printStackTrace();
                return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.BAD_REQUEST);
            }
        }

        return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.NOT_FOUND);
    }

    private String extractCartIdFromCookie(String cookieHeader) {
        if (cookieHeader == null)
            return null;

        String[] cookies = cookieHeader.split(";");
        for (String cookie : cookies) {
            String[] parts = cookie.trim().split("=");
            if (parts.length == 2 && parts[0].trim().equals("cartId")) {
                return parts[1].trim();
            }
        }
        return null;
    }

    @PutMapping("/order/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");

        Order order = orderService.findById(id);
        if (order == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        order.setStatus(status);
        orderService.saveOrder(order);
        if ("Hoàn thành".equalsIgnoreCase(status)) {
            try {
                orderService.sendDeliverySuccessMail(order.getUser().getUserName(), order.getId());
            } catch (Exception e) {
                // Log lỗi hoặc xử lý nếu cần
                System.out.println("Lỗi gửi mail: " + e.getMessage());
            }
        } // hoặc repository.save(order)
        return ResponseEntity.ok("Cập nhật trạng thái thành công");
    }

    private Order createOrder(List<Item> cart, User user, OrderRequest orderRequest) throws Exception {

        BigDecimal total = OrderUtilities.countTotalPrice(cart);

        DiscountDTO discount = null;
        if (orderRequest.getCode() != null && !orderRequest.getCode().isEmpty()) {
            try {
                discount = discountClient.applyCoupon(orderRequest.getCode());

                System.out.println(
                        "Discount: " + discount.getCode() + ", " + discount.getDiscountType() + ", "
                                + discount.getDiscountValue());

                if ("Shipping".equals(discount.getDiscountType())) {
                    BigDecimal shippingFee = BigDecimal.valueOf(30000);
                    BigDecimal discountValue = BigDecimal.valueOf(discount.getDiscountValue());
                    total = total.add(shippingFee.subtract(discountValue));
                    System.out.println(
                            "Discount: " + total);
                } else if ("Order".equals(discount.getDiscountType())) {
                    BigDecimal discountValue = BigDecimal.valueOf(discount.getDiscountValue());
                    BigDecimal discountAmount = total.multiply(discountValue);
                    total = total.subtract(discountAmount).add(BigDecimal.valueOf(30000));
                    System.out.println(
                            "Discount: " + total);
                } else {
                    total = total.max(BigDecimal.ZERO);
                }

            } catch (Exception e) {
                e.printStackTrace();
                throw new Exception("Mã giảm giá không hợp lệ hoặc hết hạn");
            }
        } else {
            total = total.add(BigDecimal.valueOf(30000));
        }

        Order order = new Order();
        order.setItems(cart);
        order.setUser(user);
        order.setTotal(total);
        order.setPriceSale(discount != null ? BigDecimal.valueOf(discount.getDiscountValue()) : null);
        order.setOrderedDate(LocalDate.now());
        order.setStatus("Đang xử lý");
        return order;
    }

}
