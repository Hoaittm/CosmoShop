package com.rainbowforest.orderservice.service;

import java.util.List;

import com.rainbowforest.orderservice.domain.Order;

public interface OrderService {
    public Order saveOrder(Order order);

    List<Order> getOrdersByUserName(String userName);

    public Order getOrderById(Long id, String userName);

    public Order getOrderByIdAndUsername(Long id, String userName);

    public Order findById(Long id);

    public boolean deleteOrderById(Long orderId);

    public List<Order> getAll();

    public void sendDeliverySuccessMail(String username, Long orderId);
    // public void sendDeliverySuccessMail(Long orderId) throws Exception;

}
