package com.daeyeodwaeyo.back.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShortsDataDTO {
  private String id;
  private String title;
  private String name;
  private String category;
  private String videoUrl;
}
