package com.daeyeodwaeyo.back.springboot.repository;

import com.daeyeodwaeyo.back.springboot.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {

  // 최신순
  List<Product> findByTitleContainingOrNameContainingOrCategoryContainingOrDescriptionContainingOrderByCreatedAtDesc(String title, String name, String category, String description);

  // 조회순 추가예정

  // 좋아요순 추가예정

  // 높은 가격순
  List<Product> findByTitleContainingOrNameContainingOrCategoryContainingOrDescriptionContainingOrderByPriceDesc(String title, String name, String category, String description);

  // 낮은 가격순
  List<Product> findByTitleContainingOrNameContainingOrCategoryContainingOrDescriptionContainingOrderByPriceAsc(String title, String name, String category, String description);
}
