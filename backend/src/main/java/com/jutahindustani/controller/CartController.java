package com.jutahindustani.controller;

import com.jutahindustani.dto.CartItemRequest;
import com.jutahindustani.dto.MessageResponse;
import com.jutahindustani.entity.Cart;
import com.jutahindustani.security.UserPrincipal;
import com.jutahindustani.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/cart", "/api/cart"})
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Cart cart = cartService.getCartByUserId(userPrincipal.getId());
        return ResponseEntity.ok(cart);
    }

    @PostMapping({"/items", "/add"})
    public ResponseEntity<Cart> addItemToCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CartItemRequest itemRequest) {
        Cart cart = cartService.addItemToCart(userPrincipal.getId(), itemRequest);
        return ResponseEntity.ok(cart);
    }

    @PutMapping({"/items/{itemId}", "/items/update/{itemId}"})
    public ResponseEntity<Cart> updateItemQuantity(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        Cart cart = cartService.updateItemQuantity(userPrincipal.getId(), itemId, quantity);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/update")
    public ResponseEntity<Cart> updateItemQuantityAlt(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) Long itemId,
            @RequestParam(required = false) Long productId,
            @RequestParam Integer quantity,
            @RequestBody(required = false) CartItemRequest updateRequest) {
        
        Long resolvedItemId = itemId;
        if (resolvedItemId == null) {
            Long resolvedProductId = productId;
            if (resolvedProductId == null && updateRequest != null) {
                resolvedProductId = updateRequest.getProductId();
            }
            final Long finalProductId = resolvedProductId;
            if (finalProductId != null) {
                Cart cart = cartService.getCartByUserId(userPrincipal.getId());
                resolvedItemId = cart.getCartItems().stream()
                        .filter(item -> item.getProduct().getId().equals(finalProductId))
                        .map(item -> item.getId())
                        .findFirst()
                        .orElse(null);
            }
        }
        
        if (resolvedItemId == null) {
            throw new RuntimeException("Cart item not found or itemId/productId not specified.");
        }
        
        Cart cart = cartService.updateItemQuantity(userPrincipal.getId(), resolvedItemId, quantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping({"/items/{itemId}", "/remove/{itemId}"})
    public ResponseEntity<Cart> removeItemFromCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long itemId) {
        Cart cart = cartService.removeItemFromCart(userPrincipal.getId(), itemId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        cartService.clearCart(userPrincipal.getId());
        return ResponseEntity.ok(new MessageResponse("Cart cleared successfully!"));
    }
}
