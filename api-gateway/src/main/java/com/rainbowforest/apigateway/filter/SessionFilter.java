package com.rainbowforest.apigateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class SessionFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(SessionFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
            org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {
        String sessionId = exchange.getRequest().getCookies().getFirst("SESSION") != null
                ? exchange.getRequest().getCookies().getFirst("SESSION").getValue()
                : "No-Session";

        logger.info("Session ID: {}", sessionId);

        // Forward session ID to downstream services via header
        exchange.getRequest().mutate()
                .header("X-Session-Id", sessionId)
                .build();

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return 10;
    }
}
