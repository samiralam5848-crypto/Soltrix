package com.jutahindustani.service;

import com.jutahindustani.dto.CartItemRequest;
import com.jutahindustani.entity.Cart;

public interface CartService {
    Cart getCartByUserId(Long userId);
    Cart addItemToCart(Long userId, CartItemRequest itemRequest);
    Cart updateItemQuantity(Long userId, Long cartItemId, Integer quantity);
    Cart removeItemFromCart(Long userId, Long cartItemId);
    void clearCart(Long userId);
}
