package com.daeyeodwaeyo.back.springboot.dto;

import com.daeyeodwaeyo.back.springboot.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailDTO {
  private String id;
  private String title;
  private String name;
  private String category;
  private int price;
  private LocalDate startDate;
  private LocalDate endDate;
  private String description;
  private LocalDateTime createdAt;
  private String writerId;
  private List<String> imageUrls;
  private String videoUrl;
}
