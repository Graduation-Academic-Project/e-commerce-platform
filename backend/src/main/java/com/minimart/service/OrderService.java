package com.minimart.service;

import com.minimart.dto.CheckoutRequest;
import com.minimart.entity.*;
import com.minimart.exception.BadRequestException;
import com.minimart.exception.ResourceNotFoundException;
import com.minimart.repository.CartRepository;
import com.minimart.repository.OrderItemRepository;
import com.minimart.repository.OrderRepository;
import com.minimart.repository.PaymentRepository;
import com.minimart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Handles checkout, dummy payment recording and order management business logic.
 */
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Places an order based on the items currently in the user's cart.
     * Steps:
     *  1. Read cart items for the user
     *  2. Calculate total amount using current product prices
     *  3. Create the Order record
     *  4. Create OrderItem records (snapshot of product name & price)
     *  5. Create a dummy Payment record marked as SUCCESS
     *  6. Clear the user's cart
     */
    @Transactional
    public Order placeOrder(CheckoutRequest request) {
        List<Cart> cartItems = cartRepository.findByUserId(request.getUserId());

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cannot place order: cart is empty");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        // First pass: validate products & calculate total
        for (Cart item : cartItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + item.getProductId()));
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // Create order header
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PLACED);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setCustomerName(request.getCustomerName());
        order.setAddress(request.getAddress());
        order.setMobileNumber(request.getMobileNumber());
        Order savedOrder = orderRepository.save(order);

        // Create order items (snapshot product details at time of purchase)
        for (Cart item : cartItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + item.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(savedOrder.getId());
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getProductName());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItemRepository.save(orderItem);
        }

        // Record a dummy successful payment (no real gateway is used)
        Payment payment = new Payment();
        payment.setOrderId(savedOrder.getId());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        // Clear the cart since the order has been placed
        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        try {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid order status: " + status);
        }
        return orderRepository.save(order);
    }
}
