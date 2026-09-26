package com.jutahindustani.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonIgnore
    private Cart cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "selected_size", nullable = false)
    private String selectedSize; // Selected size for this cart item

    // ==========================================
    // Backward Compatibility Getters/Setters for Frontend
    // ==========================================

    @JsonProperty("size")
    public String getSize() {
        return selectedSize;
    }

    public void setSize(String size) {
        this.selectedSize = size;
    }
}
