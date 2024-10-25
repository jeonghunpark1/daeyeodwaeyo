package com.daeyeodwaeyo.back.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
  private String id;
  private String title;
  private String name;
  private String category;
  private int price;
  private LocalDate startDate;
  private LocalDate endDate;
  private String description;
}
