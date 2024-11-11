package com.daeyeodwaeyo.back.springboot.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Setter
@Getter
public class ChangeUserInfoDTO {
  private String id;
  private String password;
  private String name;
  private String phoneNumber;
  private String address;
  private String email;
  private MultipartFile profileImage;
  private String nickName;

  // 내정보 변경에서 현재 비밀번호 확인할 때 유저의 비밀번호를 제공하는 생성자
  public ChangeUserInfoDTO(String password) {
    this.password = password;
  }

  // 비밀번호, 주소, 닉네임 변경
  public ChangeUserInfoDTO(String id, String changeInfo) {
    this.id = id;
    this.password = changeInfo;
    this.address = changeInfo;
    this.nickName = changeInfo;
  }

  // 프로필 사진 변경
  public ChangeUserInfoDTO(String id, MultipartFile changeProfileImage) {
    this.id = id;
    this.profileImage = changeProfileImage;
  }
}
