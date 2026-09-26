package com.jutahindustani.service;

import com.jutahindustani.entity.WishlistItem;
import java.util.List;

public interface WishlistService {
    WishlistItem addToWishlist(Long userId, Long productId);
    void removeFromWishlist(Long userId, Long productId);
    List<WishlistItem> getWishlistByUserId(Long userId);
    boolean isProductInWishlist(Long userId, Long productId);
}
