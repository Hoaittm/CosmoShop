package com.rainbowforest.userservice.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // @Bean
    // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // http
    // .csrf(csrf -> csrf.disable()) // Tắt CSRF nếu là API REST
    // .authorizeHttpRequests(auth -> auth
    // .requestMatchers("api/account/registration", "api/account/login",
    // "/public/**").permitAll() // Cho
    // // phép
    // // truy
    // // cập
    // // không
    // // cần auth
    // .anyRequest().authenticated() // Những request khác cần auth
    // )
    // .httpBasic(); // Có thể dùng .formLogin() nếu dùng form, hoặc dùng JWT thì
    // custom filter

    // return http.build();
    // }
}
