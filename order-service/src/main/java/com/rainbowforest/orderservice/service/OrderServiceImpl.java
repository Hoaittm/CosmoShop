package com.rainbowforest.orderservice.service;

import com.rainbowforest.orderservice.DTO.UserResponse;
import com.rainbowforest.orderservice.domain.Item;
import com.rainbowforest.orderservice.domain.Order;
import com.rainbowforest.orderservice.domain.User;
import com.rainbowforest.orderservice.feignclient.UserClient;
import com.rainbowforest.orderservice.repository.OrderRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserClient userClient;
    @Autowired
    private EmailService emailService;

    @Override
    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    @Override
    public Order findById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override

    public List<Order> getOrdersByUserName(String userName) {
        return orderRepository.findByUser_UserName(userName);
    }

    @Override
    public boolean deleteOrderById(Long orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            orderRepository.deleteById(orderId);
            return true;
        }
        return false;
    }

    @Override
    public Order getOrderById(Long id, String userName) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    public Order getOrderByIdAndUsername(Long id, String userName) {
        return orderRepository.findByIdAndUser_UserName(id, userName)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public void sendDeliverySuccessMail(String username, Long orderId) {
        System.out.println("Bắt đầu gửi mail thông báo đơn hàng đã giao thành công");
        System.out.println("Nhận vào username: " + username + ", orderId: " + orderId);

        Optional<Order> orderOpt = orderRepository.findByIdAndUser_UserName(orderId, username);

        if (orderOpt.isEmpty()) {
            System.out.println("Không tìm thấy đơn hàng với ID " + orderId + " và username " + username);
            throw new RuntimeException("Không tìm thấy đơn hàng với ID " + orderId + " và username " + username);
        }

        Order order = orderOpt.get();
        System.out.println("Tìm thấy đơn hàng với ID: " + order.getId() + ", trạng thái: " + order.getStatus());

        // Kiểm tra trạng thái đơn hàng
        if ("Hoàn thành".equalsIgnoreCase(order.getStatus())) {
            System.out.println("Trạng thái đơn hàng là 'Hoàn thành', tiến hành lấy email");

            User user = order.getUser();
            String email = user.getUserName(); // Lấy email trực tiếp từ User
            System.out.println("Email lấy được từ userName: " + email);

            if (email == null || email.isEmpty()) {
                System.out.println("Không tìm thấy email cho user: " + username);
                throw new RuntimeException("Không tìm thấy email cho user: " + username);
            }
            StringBuilder productListHtml = new StringBuilder();

            productListHtml.append("<table style=\"width: 100%; border-collapse: collapse;\">")
                    .append("<thead>")
                    .append("<tr style=\"background-color: #f2f2f2;\">")
                    .append("<th style=\"border: 1px solid #ddd; padding: 8px; text-align: left;\">Sản phẩm</th>")
                    .append("<th style=\"border: 1px solid #ddd; padding: 8px; text-align: center;\">Số lượng</th>")
                    .append("<th style=\"border: 1px solid #ddd; padding: 8px; text-align: right;\">Thành tiền</th>")
                    .append("</tr>")
                    .append("</thead>")
                    .append("<tbody>");

            for (Item item : order.getItems()) {
                String productName = item.getProduct().getProductName();
                int quantity = item.getQuantity();
                BigDecimal subtotal = item.getSubTotal();

                productListHtml.append("<tr>")
                        .append("<td style=\"border: 1px solid #ddd; padding: 8px;\">").append(productName)
                        .append("</td>")
                        .append("<td style=\"border: 1px solid #ddd; padding: 8px; text-align: center;\">")
                        .append(quantity).append("</td>")
                        .append("<td style=\"border: 1px solid #ddd; padding: 8px; text-align: right;\">")
                        .append(subtotal).append(" VND</td>")
                        .append("</tr>");
            }

            productListHtml.append("</tbody></table>");
            BigDecimal totalAmount = order.getTotal();
            BigDecimal discountAmount = order.getPriceSale();
            if (discountAmount == null) {
                discountAmount = BigDecimal.ZERO;
                System.out.println("discountAmount từ order.getPriceSale() là null. Đã đặt về 0.");
            }
            BigDecimal HUNDRED = new BigDecimal("100");
            BigDecimal FIXED_ADDITION = new BigDecimal("30000");
            StringBuilder totalSummaryHtml = new StringBuilder();

            totalSummaryHtml.append("<p style=\"margin-top: 15px;\"><strong>Tổng cộng:</strong> ")
                    .append(String.format("%,.0f", totalAmount)).append(" VNĐ</p>");

            // So sánh BigDecimal với BigDecimal.ZERO
            if (discountAmount.compareTo(BigDecimal.ZERO) > 0) {
                // Bước 1: Tính số tiền giảm giá: (discountPercentage * totalAmount) / 100
                // Đầu tiên, nhân discountPercentage với totalAmount
                BigDecimal multipliedValue = discountAmount.multiply(totalAmount);

                // Sau đó, chia cho 100. Làm tròn về số nguyên vì đây là số tiền giảm giá.
                BigDecimal calculatedDiscountAmount = multipliedValue.divide(HUNDRED, 0, RoundingMode.HALF_UP);

                // Bước 2: Tính số tiền sau khi áp dụng giảm giá: totalAmount -
                // calculatedDiscountAmount
                BigDecimal amountAfterDiscount = totalAmount.subtract(calculatedDiscountAmount);

                // Bước 3: Cộng thêm phụ phí cố định 30000
                BigDecimal finalAmount = amountAfterDiscount.add(FIXED_ADDITION);
                // Đảm bảo thành tiền không âm (nếu discountAmount quá lớn)
                if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
                    finalAmount = BigDecimal.ZERO;
                }

                totalSummaryHtml.append("<p><strong>Giảm giá:</strong> ").append(String.format("%,.0f", discountAmount))
                        .append(" %</p>")
                        .append("<p style=\"font-size: 1.1em;\"><strong>Thành tiền:</strong> <span style=\"color: #e60023; font-weight: bold;\">")
                        .append(String.format("%,.0f", finalAmount)).append(" đ</span></p>");
            } else {
                totalSummaryHtml.append(
                        "<p style=\"font-size: 1.1em;\"><strong>Tổng tiền:</strong> <span style=\"color: #28a745; font-weight: bold;\">")
                        .append(String.format("%,.0f", totalAmount)).append(" đ</span></p>");
            }
            // --- Kết thúc HTML cho tổng tiền ---

            // --- Bắt đầu xây dựng HTML cho nút Đánh giá đơn hàng ---

            String subject = "Veya Shop: Đơn hàng của bạn đã được giao thành công!";
            String content = "<div style=\"font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);\">"
                    + "<h2 style=\"color: #1a73e8; text-align: center; margin-bottom: 20px;\">VeyaShop xin chào quý khách "
                    + ",</h2>"
                    + "<p style=\"text-align: center; font-size: 1.1em;\">Đơn hàng của bạn đã được <strong style=\"color: #28a745;\">giao thành công</strong>. Cảm ơn bạn đã tin tưởng Veya Shop!</p>"
                    + "<div style=\"background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 25px;\">"
                    + "<p style=\"margin-bottom: 5px;\"><strong>Mã đơn hàng:</strong> <span style=\"color: #1a73e8; font-weight: bold;\">"
                    + order.getId() + "</span></p>"
                    + "<p style=\"margin-top: 5px;\"><strong>Trạng thái:</strong> <span style=\"color: #6c757d;\">"
                    + order.getStatus() + "</span></p>"
                    + "</div>"
                    + "<h3 style=\"color: #1a73e8; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 25px; margin-bottom: 15px;\">Chi tiết đơn hàng:</h3>"
                    + productListHtml.toString()
                    + totalSummaryHtml.toString()
                    + "<p style=\"margin-top: 30px; text-align: center; font-size: 0.9em; color: #777;\">Bạn có câu hỏi? Hãy liên hệ với chúng tôi tại <a href=\"mailto:support@veyashop.com\" style=\"color: #1a73e8; text-decoration: none;\">support@veyashop.com</a></p>"
                    + "<p style=\"margin-top: 15px; font-size: 0.9em; color: #777; text-align: center;\">Trân trọng,<br>Đội ngũ Veya Shop</p>"
                    + "</div>";

            System.out.println("Gửi email tới: " + email);
            emailService.sendEmail(email, subject, content);
            System.out.println("Đã gửi mail thành công.");
        } else {
            System.out.println("Trạng thái đơn hàng không phải 'Hoàn thành'. Mail không được gửi.");
        }
    }

}
