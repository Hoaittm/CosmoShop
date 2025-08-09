package com.rainbowforest.apigateway.config;

import com.rainbowforest.apigateway.filter.SessionFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiConfig {

    @Bean(name = "customSessionFilter")
    public SessionFilter sessionFilter() {
        return new SessionFilter();
    }
}
