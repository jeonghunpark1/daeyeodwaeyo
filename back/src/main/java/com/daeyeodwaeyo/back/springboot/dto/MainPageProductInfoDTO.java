package com.daeyeodwaeyo.back.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class MainPageProductInfoDTO {
  private String id;
  private String title;
  private String name;
  private String category;
  private String imageUrl;
}
