package com.daeyeodwaeyo.back.springboot.repository;

import com.daeyeodwaeyo.back.springboot.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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

  // name에 해당하는 모든 product의 price를 리스트로 조회
  @Query("SELECT p.price FROM Product p WHERE p.name = :name")
  List<Integer> findPricesByName(String name);

  // 최신 등록된 제품을 가져오는 메서드
  Page<Product> findAll(Pageable pageable);

  // 사용자의 ID로 등록된 제품을 가져오는 메서드
  List<Product> findByUserId(String userID);
}
