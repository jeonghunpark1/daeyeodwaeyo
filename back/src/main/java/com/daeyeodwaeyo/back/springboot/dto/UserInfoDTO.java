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

  // 내정보 페이지에서 유저 정보를 제공하는 생성자
  public UserInfoDTO(String id, String name, String phoneNumber, String address, String email, String profileImage, String nickName) {
    this.id = id;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.email = email;
    this.profileImage = profileImage;
    this.nickName = nickName;
  }

  // 내정보 변경에서 현재 비밀번호 확인할 때 유저의 비밀번호를 제공하는 생성자
  public UserInfoDTO(String password) {
    this.password = password;
  }
}
