package com.daeyeodwaeyo.back.springboot.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "productImage")
@Getter
@Setter
@NoArgsConstructor // Lombok: 기본 생성자 생성
@AllArgsConstructor // Lombok: 모든 필드를 이용한 생성자 생성
public class ProductImage {
  @Id
  @Column(name = "id", nullable = false, length = 255)
  private String id; // UUID로 생성

  @Column(name = "image_url", nullable = false, length = 255)
  private  String imageUrl;

  @ManyToOne
  @JoinColumn(name = "product_id", nullable = false)
  private Product product;
}
