package com.daeyeodwaeyo.back.springboot.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

//로그인 요청에서 사용되는 데이터 전송 객체 (DTO)
//사용자가 입력한 이메일과 비밀번호를 서버로 전달하는 데 사용
@Getter
@Setter
public class UserLoginDTO {

  // 아이디는 필수 입력 항목
  @NotBlank(message = "아이디는 필수 항목입니다.")
  private String id;

  // 비밀번호는 필수 입력 항목
  @NotBlank(message = "비밀번호는 필수 항목입니다.")
  private String password;
}
