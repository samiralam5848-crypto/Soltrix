package com.jutahindustani.service;

import com.jutahindustani.entity.Product;
import com.jutahindustani.entity.Category;
import com.jutahindustani.repository.CategoryRepository;
import com.jutahindustani.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.searchProducts(query);
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryNameIgnoreCase(category);
    }

    @Override
    public List<Product> searchProductsWithCategory(String query, String category) {
        if (category == null || category.trim().isEmpty() || "ALL".equalsIgnoreCase(category.trim())) {
            return searchProducts(query);
        }
        if (query == null || query.trim().isEmpty()) {
            return getProductsByCategory(category);
        }
        return productRepository.searchProductsWithCategory(query.trim(), category.trim());
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Override
    @Transactional
    public Product saveProduct(Product product) {
        if (product.getCategory() != null && product.getCategory().getName() != null) {
            String catName = product.getCategory().getName();
            Category category = categoryRepository.findByNameIgnoreCase(catName)
                    .orElseGet(() -> categoryRepository.save(Category.builder().name(catName.toUpperCase()).build()));
            product.setCategory(category);
        }

        if (product.getProductImages() != null) {
            product.getProductImages().forEach(img -> img.setProduct(product));
        }

        if (product.getProductSizes() != null) {
            product.getProductSizes().forEach(sz -> sz.setProduct(product));
        }

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        
        product.setTitle(productDetails.getTitle());
        product.setBrand(productDetails.getBrand());
        product.setDescription(productDetails.getDescription());
        product.setGender(productDetails.getGender() != null ? productDetails.getGender() : "Unisex");
        product.setColor(productDetails.getColor() != null ? productDetails.getColor() : "Multicolor");
        product.setPrice(productDetails.getPrice());
        product.setDiscountPrice(productDetails.getDiscountPrice());
        product.setStock(productDetails.getStock());
        
        if (productDetails.getCategory() != null && productDetails.getCategory().getName() != null) {
            String catName = productDetails.getCategory().getName();
            Category category = categoryRepository.findByNameIgnoreCase(catName)
                    .orElseGet(() -> categoryRepository.save(Category.builder().name(catName.toUpperCase()).build()));
            product.setCategory(category);
        }
        
        if (productDetails.getProductImages() != null) {
            product.getProductImages().clear();
            productDetails.getProductImages().forEach(img -> {
                img.setProduct(product);
                product.getProductImages().add(img);
            });
        }
        
        if (productDetails.getProductSizes() != null) {
            product.getProductSizes().clear();
            productDetails.getProductSizes().forEach(sz -> {
                sz.setProduct(product);
                product.getProductSizes().add(sz);
            });
        }

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
