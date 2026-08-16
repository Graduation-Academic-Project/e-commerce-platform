package com.minimart.repository;

import com.minimart.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Simple search by product name or category (case-insensitive, partial match)
    List<Product> findByProductNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(String name, String category);
}
