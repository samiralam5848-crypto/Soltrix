package com.jutahindustani.controller;

import com.jutahindustani.dto.OrderRequest;
import com.jutahindustani.entity.Order;
import com.jutahindustani.security.UserPrincipal;
import com.jutahindustani.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/v1/orders", "/api/orders"})
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping({"", "/create"})
    public ResponseEntity<Order> checkout(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody OrderRequest orderRequest) {
        Order order = orderService.createOrder(userPrincipal.getId(), orderRequest);
        return ResponseEntity.ok(order);
    }

    @GetMapping({"", "/user"})
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Order> orders = orderService.getOrdersByUserId(userPrincipal.getId());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderDetails(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderById(userPrincipal.getId(), orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }
}
