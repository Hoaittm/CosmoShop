package com.rainbowforest.orderservice.controller;

import com.rainbowforest.orderservice.http.header.HeaderGenerator;
import com.rainbowforest.orderservice.service.CartService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shop")
public class CartController {
	@Autowired
	CartService cartService;

	@Autowired
	private HeaderGenerator headerGenerator;

	@GetMapping(value = "/cart")
	public ResponseEntity<List<Object>> getCart(@RequestHeader(value = "Cookie") String cookie) {
		String cartId = extractCartIdFromCookie(cookie);
		List<Object> cart = cartService.getCart(cartId);
		if (!cart.isEmpty()) {
			return new ResponseEntity<List<Object>>(
					cart,
					headerGenerator.getHeadersForSuccessGetMethod(),
					HttpStatus.OK);
		}
		return new ResponseEntity<List<Object>>(
				headerGenerator.getHeadersForError(),
				HttpStatus.NOT_FOUND);
	}

	private String extractCartIdFromCookie(String cookie) {
		// Phân tích cookie và trích xuất cartId
		String cartIdPrefix = "cartId=";
		int startIdx = cookie.indexOf(cartIdPrefix) + cartIdPrefix.length();
		int endIdx = cookie.indexOf(";", startIdx);
		if (endIdx == -1) {
			endIdx = cookie.length();
		}
		return cookie.substring(startIdx, endIdx);
	}

	@PostMapping(value = "/cart", params = { "productId", "quantity" })
	public ResponseEntity<List<Object>> addItemToCart(

			@CookieValue(value = "cartId", required = false) String cartId,
			@RequestParam("productId") Long productId,
			@RequestParam("quantity") Integer quantity,
			HttpServletRequest request,
			HttpServletResponse response) {
		try {
			if (cartId == null || cartId.isEmpty()) {
				cartId = "cart_" + System.currentTimeMillis(); // tạo mới nếu chưa có
				response.addHeader("Set-Cookie", "cartId=" + cartId + "; Path=/; HttpOnly");
			}

			List<Object> cart = cartService.getCart(cartId);
			if (cart != null) {
				if (cart.isEmpty()) {
					cartService.addItemToCart(cartId, productId, quantity);
				} else {
					if (cartService.checkIfItemIsExist(cartId, productId)) {
						cartService.changeItemQuantity(cartId, productId, quantity);
					} else {
						cartService.addItemToCart(cartId, productId, quantity);
					}
				}
				List<Object> updatedCart = cartService.getCart(cartId);
				return new ResponseEntity<>(
						updatedCart,
						headerGenerator.getHeadersForSuccessPostMethod(request, cartId),
						HttpStatus.CREATED);
			}
			return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.BAD_REQUEST);
		} catch (Exception ex) {
			ex.printStackTrace();
			return new ResponseEntity<>(headerGenerator.getHeadersForError(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping(value = "/cart", params = "productId")
	public ResponseEntity<Void> removeItemFromCart(
			@RequestParam("productId") Long productId,
			@RequestHeader(value = "Cookie") String cookieHeader) {

		String cartId = extractCartIdFromCookie(cookieHeader); // dùng hàm helper

		if (cartId != null && cartService.getCart(cartId) != null) {
			cartService.deleteItemFromCart(cartId, productId);
			return new ResponseEntity<>(
					headerGenerator.getHeadersForSuccessGetMethod(),
					HttpStatus.OK);
		}
		return new ResponseEntity<>(
				headerGenerator.getHeadersForError(),
				HttpStatus.NOT_FOUND);
	}

	@DeleteMapping(value = "/cart/del")
	public ResponseEntity<Void> deleteCart(
			@RequestHeader(value = "Cookie", required = false) String cookieHeader) {

		String cartId = extractCartIdFromCookie(cookieHeader); // Trích xuất cartId từ Cookie

		if (cartId != null && cartService.getCart(cartId) != null) {
			cartService.deleteCart(cartId);
			return new ResponseEntity<>(
					headerGenerator.getHeadersForSuccessGetMethod(),
					HttpStatus.OK);
		}
		return new ResponseEntity<>(
				headerGenerator.getHeadersForError(),
				HttpStatus.NOT_FOUND);
	}

	@PostMapping(value = "/cart/change-quantity", params = { "productId", "quantity" })
	public ResponseEntity<List<Object>> changeItemQuantity(
			@RequestParam("productId") Long productId,
			@RequestParam("quantity") Integer quantity,
			@RequestHeader(value = "Cookie") String cartId,
			HttpServletRequest request,
			HttpServletResponse response) {
		try {
			// Lấy giỏ hàng dựa trên cartId (String)
			List<Object> cart = cartService.getCart(cartId);
			if (cart != null) {
				if (cart.isEmpty()) {
					cartService.changeItemQuantity(cartId, productId, quantity);
					System.out.println("Cart after change item quantity: " + cartService.getCart(cartId));
				} else {
					if (cartService.checkIfItemIsExist(cartId, productId)) {
						cartService.changeItemQuantity(cartId, productId, quantity);
					} else {
						cartService.addItemToCart(cartId, productId, quantity);
					}
				}
				// Lấy lại giỏ hàng sau khi thêm sản phẩm
				List<Object> updatedCart = cartService.getCart(cartId);
				return new ResponseEntity<>(
						updatedCart, // Trả về giỏ hàng đã cập nhật
						headerGenerator.getHeadersForSuccessPostMethod(request, cartId),
						HttpStatus.CREATED);

			}
			return new ResponseEntity<>(
					headerGenerator.getHeadersForError(),
					HttpStatus.BAD_REQUEST);
		} catch (Exception ex) {
			return new ResponseEntity<>(
					headerGenerator.getHeadersForError(),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
