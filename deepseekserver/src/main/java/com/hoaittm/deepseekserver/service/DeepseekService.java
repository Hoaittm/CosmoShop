package com.hoaittm.deepseekserver.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hoaittm.deepseekserver.model.Posts;
import com.hoaittm.deepseekserver.respository.PostRepository;
import com.opencsv.CSVReader;

@Service
public class DeepseekService {

    @Value("${api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    private final PostRepository postRepository;

    private final String SHEET_URL = "https://docs.google.com/spreadsheets/d/18WYWY1WhtY_8IOAgZQG8grMr-mNX6gVRZFE1prBOciw/export?format=csv&gid=0";
    // Constructor để tiêm RestTemplate

    public DeepseekService(RestTemplate restTemplate, PostRepository postRepository) {
        this.restTemplate = restTemplate;
        this.postRepository = postRepository;
    }

    public List<Posts> getProductsFromSheet() {
        List<Posts> products = new ArrayList<>();
        try {
            URL url = new URL(SHEET_URL); // Ví dụ:
                                          // https://docs.google.com/spreadsheets/d/{id}/export?format=csv&gid={gid}
            try (CSVReader reader = new CSVReader(new InputStreamReader(url.openStream(), "UTF-8"))) {
                String[] columns;
                boolean isHeader = true;
                while ((columns = reader.readNext()) != null) {
                    if (isHeader) {
                        isHeader = false; // Bỏ qua header
                        continue;
                    }
                    if (columns.length >= 3) {
                        products.add(new Posts(null, columns[1], columns[3], columns[4]));
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return products;
    }

    private String callDeepSeek1(String prompt) {
        String url = "https://openrouter.ai/api/v1/chat/completions"; // Thay bằng URL thực tế
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey); // API key thực tế
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "deepseek/deepseek-chat");
        requestBody.put("messages", List.of(
                Map.of("role", "system", "content", "Bạn là trợ lý viết nội dung chuyên nghiệp."),
                Map.of("role", "user", "content", prompt)));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");

        return (String) ((Map) choices.get(0).get("message")).get("content");
    }

    public String callDeepSeek(String message) {
        try {
            String url = "https://openrouter.ai/api/v1/chat/completions"; // Thay bằng URL thực tế
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey); // API key thực tế
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> systemMessage = Map.of(
                    "role", "system",
                    "content",
                    """
                                Bạn là một trợ lý bán hàng thân thiện cho website thương mại điện tử.
                                Nếu người dùng hỏi:
                                - Về sản phẩm (ví dụ: tôi muốn mua son, tôi muốn mua má hồng, tôi muốn mua phấn), gợi ý 3 sản phẩm phù hợp (giả định nếu không gọi API thực).
                                - Về đơn hàng, yêu cầu cung cấp mã đơn hàng.
                                - Về giao hàng, thông báo thời gian giao hàng là 2-5 ngày.
                                - Về phí vận chuyển, nói rõ là từ 15.000đ đến 30.000đ tùy địa chỉ.
                                Nếu không rõ, hãy hỏi lại để làm rõ yêu cầu.
                            """);

            Map<String, Object> userMessage = Map.of(
                    "role", "user",
                    "content", message);

            Map<String, Object> body = Map.of(
                    "model", "deepseek/deepseek-r1:free",
                    "messages", List.of(systemMessage, userMessage),
                    "temperature", 0.7);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> messageMap = (Map<String, Object>) choices.get(0).get("message");
                return (String) messageMap.get("content");
            } else {
                return "Không thể tạo phản hồi từ AI.";
            }

        } catch (Exception e) {
            return "Lỗi khi kết nối đến DeepSeek. Vui lòng thử lại sau.";
        }
    }
}
