package com.daeyeodwaeyo.back.springboot.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

//회원가입 요청에서 사용되는 데이터 전송 객체 (DTO)
//사용자가 입력한 데이터를 서버로 전달하는 데 사용된다.
@Getter
@Setter
public class UserRegisterDTO {

  // 아이디는 필수 입력 항목이며 최소 4글자 이상이어야 한다.
  @NotBlank(message = "아이디는 필수 항목입니다.")
  @Size(min = 4, message = "아이디는 최소 4글자 이상이어야 합니다.")
  private String id;

  // 비밀번호는 필수 입력 항목이며 최소 8글자 이상이어야 한다.
  @NotBlank(message = "비밀번호는 필수 항목입니다.")
  @Size(min = 8, message = "비밀번호는 최소 8글자 이상이어야 합니다.")
  private String password;

  // 이름은 필수 입력 항목
  @NotBlank(message = "이름은 필수 항목입니다.")
  private String name;

  // 전화번호는 필수 입력 항목
  @NotBlank(message = "전화번호는 필수 항복입니다.")
  private String phoneNumber;

  // 주소는 필수 입력 항목
  @NotBlank(message = "주소는 필수 항목입니다.")
  private String address;

  // 이메일은 필수 입력 항목이며 형식 검사를 거침
  @NotBlank(message = "이메일은 필수 항목입니다.")
  @Email(message = "유효하지 않은 이메일 형식입니다.")
  private String email;

  // 프로필 이미지는 선택 사항이므로 필수 검사 없음
  private String profileImage;

  // 닉네임은 필수 항목이며 고유해야 함
  @NotBlank(message = "닉네임은 필수 항목입니다.")
  private String nickName;
}
