package com.daeyeodwaeyo.back.springboot.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class AddProductDTO {

  private String title;
  private String name;
  private String category;
  private BigDecimal price;
  private LocalDateTime startDate;
  private LocalDateTime endDate;
  private String description;
}
