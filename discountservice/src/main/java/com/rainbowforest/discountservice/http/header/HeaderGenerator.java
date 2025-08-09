package com.rainbowforest.discountservice.http.header;

import java.net.URI;
import java.net.URISyntaxException;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class HeaderGenerator {

	public HttpHeaders getHeadersForSuccessGetMethod() {
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.add("Content-Type", "application/json; charset=UTF-8");
		return httpHeaders;
	}

	public HttpHeaders getHeadersForError() {
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.add("Content-Type", "application/problem+json; charset=UTF-8");
		return httpHeaders;
	}

	public HttpHeaders getHeadersForAuthorization(String token) {
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.add("Authorization", "Bearer " + token); // Thêm token vào header
		return httpHeaders;
	}

	public HttpHeaders getHeadersForSuccessPostMethod(HttpServletResponse request,
			String newResourceId) {
		HttpHeaders httpHeaders = new HttpHeaders();
		try {
			httpHeaders.setLocation(new URI(((HttpServletRequest) request).getRequestURI() + "/" + newResourceId));
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		httpHeaders.add("Content-Type", "application/json; charset=UTF-8");
		return httpHeaders;
	}
	public HttpHeaders getHeadersForSuccessPostMethod(HttpServletRequest request,
			String newResourceId) {
		HttpHeaders httpHeaders = new HttpHeaders();
		try {
			httpHeaders.setLocation(new URI(((HttpServletRequest) request).getRequestURI() + "/" + newResourceId));
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		httpHeaders.add("Content-Type", "application/json; charset=UTF-8");
		return httpHeaders;
	}

	public HttpHeaders getHeadersForSuccessPostMethodForOrder(HttpServletResponse request, String cartId) {
		HttpHeaders httpHeaders = new HttpHeaders();
		try {
			httpHeaders.setLocation(
					new URI(((jakarta.servlet.http.HttpServletRequest) request).getRequestURI() +
							"/" + cartId));
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		httpHeaders.add("Content-Type", "application/json; charset=UTF-8");
		return httpHeaders;
	}

	public HttpHeaders getHeadersForSuccessPostMethodForOrder(HttpServletRequest request, String cartId) {
		HttpHeaders httpHeaders = new HttpHeaders();
		try {
			// Sử dụng HttpServletRequest thay vì HttpServletResponse để lấy URI
			httpHeaders.setLocation(new URI(request.getRequestURI() + "/" + cartId));
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		httpHeaders.add("Content-Type", "application/json; charset=UTF-8");
		return httpHeaders;
	}

}
