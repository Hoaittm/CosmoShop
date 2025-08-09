package com.hoaittm.deepseekserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DeepseekserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(DeepseekserverApplication.class, args);
	}

}
