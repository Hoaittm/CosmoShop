package com.hoaittm.deepseekserver.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Configuration

public class DeepseekConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
