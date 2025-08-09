package com.rainbowforest.userservice.http.header;

import java.net.URI;
import java.net.URISyntaxException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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

	public HttpHeaders getHeadersForSuccessPostMethod(HttpServletRequest request, Long newResourceId) {
		HttpHeaders httpHeaders = new HttpHeaders();
		try {
			httpHeaders.setLocation(new URI(request.getRequestURI() + "/" + newResourceId));
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		httpHeaders.add("Content-Type", "application/json; charset=UTF-8");
		return httpHeaders;
	}

	public HttpHeaders getHeadersForSuccessPostMethod(HttpServletResponse request, Long newResourceId) {
		HttpHeaders httpHeaders = new HttpHeaders();
		try {
			httpHeaders.setLocation(new URI(((HttpServletRequest) request).getRequestURI() + "/" + newResourceId));
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}
		httpHeaders.add("Content-Type", "application/json; charset=UTF-8");
		return httpHeaders;
	}

	public HttpHeaders getHeadersForSuccessPutMethod() {
		HttpHeaders httpHeaders = new HttpHeaders();
		// Đặt Content-Type là application/json với charset UTF-8
		httpHeaders.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE + "; charset=UTF-8");
		return httpHeaders;
	}
}
