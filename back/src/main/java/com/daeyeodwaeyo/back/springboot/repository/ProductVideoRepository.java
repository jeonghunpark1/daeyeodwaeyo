package com.daeyeodwaeyo.back.springboot.repository;

import com.daeyeodwaeyo.back.springboot.domain.Product;
import com.daeyeodwaeyo.back.springboot.domain.ProductVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductVideoRepository extends JpaRepository<ProductVideo, String> {
  ProductVideo findByProduct(Product product); // 특정 상품과 연관된 이미지 조회

  // 동영상 이름을 가져오는 메서드
  @Query("SELECT pv.videoUrl FROM ProductVideo pv")
  List<String> findAllVideoUrls();
}
