package com.daeyeodwaeyo.back.springboot.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ProductDTO {

  private String title;
  private String name;
  private String category;
  private String price;
  private LocalDateTime startDate;
  private LocalDateTime endDate;
  private String description;
}
