package com.daeyeodwaeyo.back.springboot.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

//User 엔티티는 users 테이블과 매핑된다.
//이 클래스는 회원가입 시 사용자의 데이터를 저장하고 관리하는 역할을 한다.
@Entity // 이 클래스가 JPA 엔티티임을 선언
@Table(name = "users") // 데이터베이스의 users 테이블과 매핑
@Getter // Lombok: 모든 필드에 대한 Getter 생성
@Setter // Lombok: 모든 필드에 대한 Setter 생성
@NoArgsConstructor // Lombok: 기본 생성자 생성
@AllArgsConstructor // Lombok: 모든 필드를 이용한 생성자 생성
public class User implements Serializable {

  // 사용자의 아이디(Primary Key 설정)
  @Id
  @Column(name = "id", length = 255, nullable = false, unique = true)
  private String id;

  // 사용자의 비밀번호(해싱되어 저장)
  @Column(name = "password", length = 255, nullable = false)
  private String password;

  // 사용자의 이름
  @Column(name = "name", length = 255, nullable = false)
  private String name;

  // 사용자의 전화번호
  @Column(name = "phoneNumber", length = 255, nullable = false)
  private String phoneNumber;

  // 사용자의 주소
  @Column(name = "address", length = 255, nullable = false)
  private String address;

  // 사용자의 이메일
  @Column(name = "email", length = 255, nullable = false)
  private String email;

  // 사용자의 프로필 이미지
  @Column(name = "profileImage", length = 255)
  private String profileImage;

  // 사용자의 닉네임
  @Column(name = "nickName", length = 255, nullable = false, unique = true)
  private String nickName;
}
