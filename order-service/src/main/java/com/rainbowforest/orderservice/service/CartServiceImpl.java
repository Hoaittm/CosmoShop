package com.rainbowforest.orderservice.service;

import com.rainbowforest.orderservice.domain.Item;
import com.rainbowforest.orderservice.domain.Product;
import com.rainbowforest.orderservice.feignclient.ProductClient;
import com.rainbowforest.orderservice.redis.CartRedisRepository;
import com.rainbowforest.orderservice.utilities.CartUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private ProductClient productClient;

    @Autowired
    private CartRedisRepository cartRedisRepository;

    @Override
    public void addItemToCart(String cartId, Long productId, Integer quantity) {
        Product product = productClient.getProductById(productId);
        if (product == null) {
            System.out.println("Product not found for ID: " + productId);
            return;
        }

        BigDecimal originalPrice = product.getPrice();
        Double priceSale = product.getPriceSale();

        // Tính giá sau giảm
        if (priceSale != null && priceSale > 0) {
            BigDecimal discountRate = BigDecimal.valueOf(priceSale).divide(BigDecimal.valueOf(100));
            BigDecimal discount = originalPrice.multiply(discountRate);
            BigDecimal discountedPrice = originalPrice.subtract(discount);
            product.setPrice(discountedPrice);
        }

        // Tính subTotal = giá sau giảm * số lượng
        BigDecimal subTotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));

        Item item = new Item(quantity, product, subTotal);
        cartRedisRepository.addItemToCart(cartId, item);
        System.out.println("Cart foddr cartId " + cartId);
        // Lấy lại giỏ hàng ngay sau khi thêm sản phẩm
        List<Object> updatedCart = (List<Object>) cartRedisRepository.getCart(cartId, Item.class);
        System.out.println("Updated cart: " + updatedCart);

    }

    @Override
    public List<Object> getCart(String cartId) {
        List<Object> cart = (List<Object>) cartRedisRepository.getCart(cartId, Item.class);
        System.out.println("Cart for cartId " + cartId + ": " + cart);
        return cart;
    }

    @Override
    public void changeItemQuantity(String cartId, Long productId, Integer quantity) {
        List<Item> cart = (List) cartRedisRepository.getCart(cartId, Item.class);
        for (Item item : cart) {
            if ((item.getProduct().getId()).equals(productId)) {
                cartRedisRepository.deleteItemFromCart(cartId, item);
                item.setQuantity(quantity);
                item.setSubTotal(CartUtilities.getSubTotalForItem(item.getProduct(), quantity));
                cartRedisRepository.addItemToCart(cartId, item);
            }
        }
    }

    @Override
    public void deleteItemFromCart(String cartId, Long productId) {
        List<Item> cart = (List) cartRedisRepository.getCart(cartId, Item.class);
        for (Item item : cart) {
            if ((item.getProduct().getId()).equals(productId)) {
                cartRedisRepository.deleteItemFromCart(cartId, item);
            }
        }
    }

    @Override
    public boolean checkIfItemIsExist(String cartId, Long productId) {
        List<Item> cart = (List) cartRedisRepository.getCart(cartId, Item.class);
        for (Item item : cart) {
            if ((item.getProduct().getId()).equals(productId)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public List<Item> getAllItemsFromCart(String cartId) {
        List<Item> items = (List) cartRedisRepository.getCart(cartId, Item.class);
        return items;
    }

    @Override
    public void deleteCart(String cartId) {
        cartRedisRepository.deleteCart(cartId);
    }
}
