package com.jutahindustani.service;

import com.jutahindustani.dto.OrderRequest;
import com.jutahindustani.entity.*;
import com.jutahindustani.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public Order createOrder(Long userId, OrderRequest orderRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartService.getCartByUserId(userId);
        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cannot place order with an empty cart");
        }

        // Create new Order
        Order order = Order.builder()
                .user(user)
                .createdAt(LocalDateTime.now())
                .shippingAddress(orderRequest.getShippingAddress())
                .status("PENDING")
                .paymentMethod("CASH_ON_DELIVERY") // default COD
                .totalPrice(0.0) // initial
                .build();

        double totalPrice = 0.0;

        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();
            
            // Check stock
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getTitle());
            }

            // Deduct stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            // Create OrderItem
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .size(cartItem.getSelectedSize())
                    .price(product.getPrice())
                    .build();

            order.getOrderItems().add(orderItem);
            totalPrice += product.getPrice() * cartItem.getQuantity();
        }

        order.setTotalPrice(totalPrice);
        Order savedOrder = orderRepository.save(order);

        // Clear user's cart
        cartService.clearCart(userId);

        return savedOrder;
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Override
    public Order getOrderById(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Allow access if user is Admin OR user owns the order
        if (user.getRole() != Role.ROLE_ADMIN && !order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to view this order");
        }

        return order;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status.toUpperCase());
        return orderRepository.save(order);
    }
}
