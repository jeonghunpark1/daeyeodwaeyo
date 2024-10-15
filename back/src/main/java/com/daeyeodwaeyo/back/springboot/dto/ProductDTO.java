package com.daeyeodwaeyo.back.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
  private String id;
  private String title;
  private String name;
  private String category;
  private String price;
  private LocalDateTime startDate;
  private LocalDateTime endDate;
  private String description;
}
