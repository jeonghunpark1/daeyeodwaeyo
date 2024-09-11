package com.daeyeodwaeyo.back.springboot.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class User implements UserDetails { // UserDetails를 상속받아 인증 객체로 사용

  @Id
  @Column(name = "id", nullable = false, unique = true)
  private String id;

  @Column(name = "password")
  private String password;

  @Column(name = "name")
  private String name;

  @Column(name = "phoneNumber")
  private String phoneNumber;

  @Column(name = "address")
  private String address;

  @Column(name = "email")
  private String email;

  @Column(name = "profileImage")
  private String profileImage;

  @Column(name = "nickName")
  private String nickName;

  @Builder
  public User(String id, String password, String name, String phoneNumber, String address, String email, String profileImage, String nickName) {
    this.id = id;
    this.password = password;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.email = email;
    this.profileImage = profileImage;
    this.nickName = nickName;
  }

  @Override // 권한 반환
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority("user"));
  }

  // 사용자의 id 반환(고유한 값)
  @Override
  public String getUsername() {
    return id;
  }

  @Override
  public String getPassword() {
    return password;
  }

  // 계정 만료 여부 반환
  @Override
  public boolean isAccountNonExpired() {
    // 만료되었는지 확인하는 로직
    return true; // true -> 만료되지 않았음
  }

  // 계정 잠금 여부 반환
  @Override
  public boolean isAccountNonLocked() {
    // 계정 잠금되었는지 확인하는 로직
    return true; // true -> 잠금되지 않았음
  }

  // 패스워드의 만료 여부 반환
  @Override
  public boolean isCredentialsNonExpired() {
    // 패스워드가 만료되었는지 확인하는 로직
    return true; // true -> 만료되지 않음
  }

  // 계정 사용 가능 여부 반환
  @Override
  public boolean isEnabled() {
    // 계정이 사용 가능한지 확인하는 로직
    return true; // true -> 사용 가능
  }
}
