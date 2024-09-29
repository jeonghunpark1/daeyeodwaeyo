package com.daeyeodwaeyo.back.springboot.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.UrlResource;

import java.net.MalformedURLException;

@Getter
@Setter
public class UserInfoDTO {
  private String id;
  private String password;
  private String name;
  private String phoneNumber;
  private String address;
  private String email;
  private String profileImage;
  private String nickName;

  // 헤더에 유저 정보를 제공하는 생성자
  public UserInfoDTO(String id, String nickName, String profileImage) {
    this.id = id;
    this.nickName = nickName;
    this.profileImage = profileImage;
  }
}
