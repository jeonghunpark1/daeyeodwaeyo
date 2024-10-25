package com.daeyeodwaeyo.back.springboot.repository;

import com.daeyeodwaeyo.back.springboot.domain.Product;
import com.daeyeodwaeyo.back.springboot.domain.ProductImage;
import com.daeyeodwaeyo.back.springboot.domain.ProductVideo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductVideoRepsitory extends JpaRepository<ProductVideo, String> {
  ProductVideo findByProduct(Product product); // 특정 상품과 연관된 이미지 조회
}
