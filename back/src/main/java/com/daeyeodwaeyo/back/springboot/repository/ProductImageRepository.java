package com.daeyeodwaeyo.back.springboot.repository;

import com.daeyeodwaeyo.back.springboot.domain.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, String> {
}
