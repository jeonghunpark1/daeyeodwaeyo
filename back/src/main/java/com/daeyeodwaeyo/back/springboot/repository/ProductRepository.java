package com.daeyeodwaeyo.back.springboot.repository;

import com.daeyeodwaeyo.back.springboot.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {

  List<Product> findByTitleContainingOrNameContainingOrCategoryContainingOrDescriptionContainingOrderByCreatedAtDesc(String title, String name, String category, String description);
}
