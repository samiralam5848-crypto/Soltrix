package com.jutahindustani.service;

import com.jutahindustani.dto.CartItemRequest;
import com.jutahindustani.entity.Cart;
import com.jutahindustani.entity.CartItem;
import com.jutahindustani.entity.Product;
import com.jutahindustani.repository.CartItemRepository;
import com.jutahindustani.repository.CartRepository;
import com.jutahindustani.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user id: " + userId));
    }

    @Override
    @Transactional
    public Cart addItemToCart(Long userId, CartItemRequest itemRequest) {
        Cart cart = getCartByUserId(userId);
        Product product = productRepository.findById(itemRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if product with same size is already in cart
        Optional<CartItem> existingItemOpt = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()) &&
                                item.getSelectedSize().equals(itemRequest.getSize()))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + itemRequest.getQuantity());
        } else {
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .selectedSize(itemRequest.getSize())
                    .build();
            cart.getCartItems().add(cartItem);
        }

        return cartRepository.save(cart);
    }

    @Override
    @Transactional
    public Cart updateItemQuantity(Long userId, Long cartItemId, Integer quantity) {
        Cart cart = getCartByUserId(userId);
        
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItem.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    @Override
    @Transactional
    public Cart removeItemFromCart(Long userId, Long cartItemId) {
        Cart cart = getCartByUserId(userId);
        
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cart.getCartItems().remove(cartItem);
        cartItemRepository.delete(cartItem);
        
        return cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }
}
