package com.jutahindustani.controller;

import com.jutahindustani.dto.MessageResponse;
import com.jutahindustani.entity.WishlistItem;
import com.jutahindustani.security.UserPrincipal;
import com.jutahindustani.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/v1/wishlist", "/api/wishlist"})
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistItem>> getWishlist(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<WishlistItem> wishlist = wishlistService.getWishlistByUserId(userPrincipal.getId());
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping({"/add/{productId}", "/{productId}"})
    public ResponseEntity<WishlistItem> addToWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId) {
        WishlistItem item = wishlistService.addToWishlist(userPrincipal.getId(), productId);
        return ResponseEntity.ok(item);
    }

    @DeleteMapping({"/remove/{productId}", "/{productId}"})
    public ResponseEntity<?> removeFromWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId) {
        wishlistService.removeFromWishlist(userPrincipal.getId(), productId);
        return ResponseEntity.ok(new MessageResponse("Product removed from wishlist successfully"));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Boolean> isProductInWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId) {
        boolean isInWishlist = wishlistService.isProductInWishlist(userPrincipal.getId(), productId);
        return ResponseEntity.ok(isInWishlist);
    }
}
