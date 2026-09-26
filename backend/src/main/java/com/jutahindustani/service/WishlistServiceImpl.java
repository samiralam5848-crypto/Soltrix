package com.jutahindustani.service;

import com.jutahindustani.entity.Product;
import com.jutahindustani.entity.User;
import com.jutahindustani.entity.WishlistItem;
import com.jutahindustani.repository.ProductRepository;
import com.jutahindustani.repository.UserRepository;
import com.jutahindustani.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public WishlistItem addToWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Check if already exists in wishlist to prevent unique constraint violation
        Optional<WishlistItem> existingItem = wishlistRepository.findByUserIdAndProductId(userId, productId);
        if (existingItem.isPresent()) {
            return existingItem.get();
        }

        WishlistItem wishlistItem = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();

        return wishlistRepository.save(wishlistItem);
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found with id: " + productId);
        }

        WishlistItem wishlistItem = wishlistRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new RuntimeException("Product not found in user's wishlist"));

        wishlistRepository.delete(wishlistItem);
    }

    @Override
    public List<WishlistItem> getWishlistByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        return wishlistRepository.findByUserId(userId);
    }

    @Override
    public boolean isProductInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }
}
