package com.hoaittm.deepseekserver.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.hoaittm.deepseekserver.model.Posts;
import com.hoaittm.deepseekserver.service.DeepseekService;

import org.springframework.http.*;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.*;

@RestController
@RequestMapping("/api/deepseek")
public class DeepseekController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final DeepseekService deepSeekService;

    public DeepseekController(DeepseekService deepseekService) {
        this.deepSeekService = deepseekService;
    }

    @GetMapping(value = "/import")
    public List<Posts> getAllProducts() {
        return deepSeekService.getProductsFromSheet();
    }

    @PostMapping

    public ResponseEntity<?> chat(@RequestBody Map<String, Object> request) {
        String message = (String) request.get("message");
        Map<String, Object> userInfo = (Map<String, Object>) request.get("user"); // Lấy thông tin user

        if (message == null || message.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("reply", "Bạn chưa nhập nội dung."));
        }

        String userName = null;
        if (userInfo != null) {
            userName = (String) userInfo.get("username"); // Lấy username từ object user
        }
        System.out.println("Username: " + userName);

        // Kiểm tra câu hỏi liên quan đến đơn hàng
        if (message.toLowerCase().contains("đơn hàng")) {
            String orderId = extractOrderId(message);
            if (orderId != null) {
                String reply = callOrderService(orderId, userName); // Truyền userName vào
                return ResponseEntity.ok(Map.of("reply", reply));
            } else {
                return ResponseEntity
                        .ok(Map.of("reply", "Vui lòng cung cấp mã đơn hàng (VD: Mã đơn hàng của tôi là 32)."));
            }
        }

        // Kiểm tra câu hỏi liên quan đến giao hàng
        if (message.toLowerCase().contains("giao hàng")) {
            return ResponseEntity
                    .ok(Map.of("reply", "Vui lòng cung cấp mã đơn hàng để tôi có thể kiểm tra giao hàng."));
        }

        // Kiểm tra câu hỏi liên quan đến tìm kiếm sản phẩm
        if (message.toLowerCase().contains("mua") || message.toLowerCase().contains("tìm")) {
            String keyword = extractKeywordForProductSearch(message);
            String productReply = callProductService(keyword);
            return ResponseEntity.ok(Map.of("reply", productReply));
        }

        // Trả lời bằng DeepSeek AI cho các câu hỏi không phải về sản phẩm hoặc đơn hàng
        String aiReply = callDeepSeek(message);
        return ResponseEntity.ok(Map.of("reply", aiReply));
    }

    private String extractOrderId(String message) {
        // Sử dụng regex để tìm dãy số có ít nhất 6 chữ số liên tiếp
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\d{1,}");
        java.util.regex.Matcher matcher = pattern.matcher(message);

        if (matcher.find()) {
            return matcher.group(); // Trả về dãy số tìm được
        }
        return null;
    }

    private String extractKeywordForProductSearch(String message) {
        // Cắt đơn giản lấy từ cuối câu sau từ "mua", "tìm", v.v.
        String lower = message.toLowerCase();
        if (lower.contains("mua")) {
            return message.substring(lower.indexOf("mua") + 3).trim();
        }
        if (lower.contains("tìm")) {
            return message.substring(lower.indexOf("tìm") + 3).trim();
        }
        if (lower.contains("sản phẩm")) {
            return message.substring(lower.indexOf("sản phẩm") + 10).trim();
        }
        return message.trim(); // fallback
    }

    private String callOrderService(String orderId, String userName) {
        try {
            // Giả sử endpoint mới chỉ cần orderId
            String url = "http://localhost:8900/api/shop/order/" + userName + "/" + orderId;
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map body = response.getBody();
            DecimalFormat decimalFormat = new DecimalFormat("#,###đ");
            double formatTotal = Double.parseDouble(body.get("total").toString());

            // Xây dựng phản hồi chi tiết hơn
            StringBuilder reply = new StringBuilder();
            reply.append("<b>Thông tin đơn hàng #").append(orderId).append("</b>:\n");
            reply.append("- Trạng thái: ").append(body.get("status")).append("\n");
            reply.append("- Ngày đặt: ").append(body.get("orderedDate")).append("\n");
            // reply.append("- Tổng tiền:
            // ").append(decimalFormat.format(formatTotal)).append("đ\n");
            reply.append("<a href='http://localhost:3000/order?status=")
                    .append(body.get("status")) // chỉ truyền status thôi
                    .append("'><button style=\"background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px;\">Xem chi tiết</button></a>");

            return reply.toString();
        } catch (Exception e) {
            return "Không tìm thấy đơn hàng #" + orderId + " hoặc có lỗi hệ thống. Vui lòng kiểm tra lại mã đơn hàng.";
        }
    }

    private String callProductService(String keyword) {
        try {
            String url = "http://localhost:8900/api/catalog/products?name=" + keyword;
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            List<Map<String, Object>> products = response.getBody();

            if (products == null || products.isEmpty()) {
                return "Không tìm thấy sản phẩm nào phù hợp với từ khóa '" + keyword + "'!";
            }

            StringBuilder reply = new StringBuilder("<ul>");
            for (int i = 0; i < Math.min(products.size(), 3); i++) {
                Map<String, Object> product = products.get(i);
                Integer productId = (Integer) product.get("id");
                String productName = (String) product.get("productName");
                String productImageUrl = (String) product.get("imageUrl");
                String productLink = (String) product.get("link");
                String correctImageUrl = "/images/products/" + productImageUrl;

                DecimalFormat decimalFormat = new DecimalFormat("#,###đ");
                reply.append("<li style='list-style-type: none;'>")
                        .append("<img src='").append(correctImageUrl).append("' width='150' /><br>")
                        .append("<strong>").append(productName).append("</strong> - ")
                        .append(decimalFormat.format(product.get("price"))).append("đ<br>")
                        .append("<a href='/product-detail/").append(productId)
                        .append("' ><button style=\"background-color:rgb(239, 107, 31); color: white; padding: 10px 20px; border: none; border-radius: 4px; margin-top: 10px\">Xem chi tiết</button></target=>")
                        .append("</li><br>");
            }
            reply.append("</ul>");

            return reply.toString(); // Trả về HTML có hình ảnh và link
        } catch (Exception e) {
            return "Không thể tìm kiếm sản phẩm. Vui lòng thử lại sau.";
        }
    }

    public String callDeepSeek(String message) {
        try {
            String apiUrl = "https://openrouter.ai/api/v1/chat/completions";

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth("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");
            headers.set("HTTP-Referer", "http://localhost:3000/");
            headers.set("X-Title", "My AI App");

            // Prompt ép trả lời bằng tiếng Việt
            String prompt = "Hãy trả lời ngắn gọn,nhanh chóng, trọng tâm, chỉ nói về chủ đề thương mại điện tử bán mỹ phẩm, và hoàn toàn bằng tiếng Việt. "
                    + message;

            // 2. Request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "deepseek/deepseek-r1:free");
            requestBody.put("messages", List.of(
                    Map.of("role", "system", "content",
                            "Bạn là trợ lý AI chuyên về thương mại điện tử, trả lời ngắn gọn, tập trung vào chủ đề này."),
                    Map.of("role", "user", "content", prompt)));

            // 3. Gửi request
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, requestEntity, Map.class);

            // 4. Xử lý response
            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                Map<String, Object> messageMap = (Map<String, Object>) choices.get(0).get("message");
                return (String) messageMap.get("content");
            } else {
                return "Lỗi từ API: " + response.getStatusCode() + " - " + response.getBody();
            }
        } catch (Exception e) {
            return "Lỗi kết nối: " + e.getMessage();
        }
    }

}
