package com.daeyeodwaeyo.back.springboot.dto;

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
public class SearchProductDTO {
  private String id;
  private String title;
  private String name;
  private String category;
  private int price;
  private LocalDate startDate;
  private LocalDate endDate;
  private List<String> imageUrl;
}
