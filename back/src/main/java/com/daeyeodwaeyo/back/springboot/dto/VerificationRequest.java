package com.daeyeodwaeyo.back.springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerificationRequest {
  private String email;
  private String type;
}
