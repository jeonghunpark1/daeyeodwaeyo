package com.daeyeodwaeyo.back.springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindPasswordRequestDTO {

  private String name;
  private String id;
  private String email;
}
