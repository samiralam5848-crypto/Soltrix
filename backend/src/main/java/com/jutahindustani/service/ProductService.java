package com.jutahindustani.service;

import com.jutahindustani.entity.Product;
import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    List<Product> searchProducts(String query);
    List<Product> getProductsByCategory(String category);
    List<Product> searchProductsWithCategory(String query, String category);
    Product getProductById(Long id);
    Product saveProduct(Product product);
    Product updateProduct(Long id, Product productDetails);
    void deleteProduct(Long id);
}
