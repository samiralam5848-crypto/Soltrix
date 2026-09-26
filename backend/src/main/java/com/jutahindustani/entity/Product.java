package com.jutahindustani.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    @Builder.Default
    private String gender = "Unisex"; // e.g. Men, Women, Unisex

    @Column(nullable = false)
    @Builder.Default
    private String color = "Multicolor";

    @Column(nullable = false)
    private Double price;

    @Column(name = "discount_price")
    private Double discountPrice;

    @Column(nullable = false)
    private Integer stock;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<ProductImage> productImages = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<ProductSize> productSizes = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // ==========================================
    // Backward Compatibility Getters for Frontend
    // ==========================================

    @com.fasterxml.jackson.annotation.JsonProperty("name")
    public String getName() {
        return title;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("imageUrl")
    public String getImageUrl() {
        if (productImages != null && !productImages.isEmpty()) {
            return productImages.get(0).getImageUrl();
        }
        return null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("sizes")
    public String getSizes() {
        if (productSizes != null && !productSizes.isEmpty()) {
            return productSizes.stream()
                    .map(ProductSize::getSize)
                    .collect(Collectors.joining(","));
        }
        return "";
    }

    @com.fasterxml.jackson.annotation.JsonProperty("categoryName")
    public String getCategoryName() {
        return category != null ? category.getName() : null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("category")
    public String getCategoryComp() {
        return category != null ? category.getName() : null;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("name")
    public void setName(String name) {
        this.title = name;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("imageUrl")
    public void setImageUrlComp(String url) {
        this.productImages = new ArrayList<>();
        if (url != null && !url.trim().isEmpty()) {
            ProductImage pi = ProductImage.builder()
                    .imageUrl(url)
                    .product(this)
                    .build();
            this.productImages.add(pi);
        }
    }

    @com.fasterxml.jackson.annotation.JsonProperty("sizes")
    public void setSizesComp(String sizesStr) {
        this.productSizes = new ArrayList<>();
        if (sizesStr != null && !sizesStr.trim().isEmpty()) {
            String[] sizeArray = sizesStr.split(",");
            for (String size : sizeArray) {
                String cleanSize = size.trim();
                if (!cleanSize.isEmpty()) {
                    ProductSize ps = ProductSize.builder()
                            .size(cleanSize)
                            .quantity(12)
                            .product(this)
                            .build();
                    this.productSizes.add(ps);
                }
            }
        }
    }

    @com.fasterxml.jackson.annotation.JsonProperty("category")
    public void setCategoryComp(Object categoryObj) {
        if (categoryObj instanceof String) {
            this.category = Category.builder().name((String) categoryObj).build();
        } else if (categoryObj instanceof java.util.Map) {
            java.util.Map<?, ?> map = (java.util.Map<?, ?>) categoryObj;
            String name = (String) map.get("name");
            Long id = map.get("id") != null ? Long.valueOf(map.get("id").toString()) : null;
            this.category = Category.builder().id(id).name(name).build();
        }
    }
}
