package com.daeyeodwaeyo.back.springboot.repository;

import com.daeyeodwaeyo.back.springboot.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//UserRepository는 User 엔티티와 데이터베이스 간의 상호작용을 처리한다.
//JpaRepository를 상속하여 기본적인 CRUD 작업을 자동으로 처리할 수 있다.
@Repository // 스프링 컴포넌트 스캔을 통해 리포지토리를 인식하도록 설정
public interface UserRepository extends JpaRepository<User, String> {

//  이메일로 사용자를 찾는 커스텀 메서드
//  스프링 데이터 JPA는 메서드 이름을 분석하여 쿼리를 자동으로 생성한다.
//
//  @param email 찾고자 하는 사용자의 이메일
//  @return 해당 이메일을 가진 사용자 (없으면 null 반환)
  User findByEmail(String email);

//  닉네임으로 사용자를 찾는 커스텀 메서드
//  @Param nickName 찾고자 하는 사용자의 닉네임
//  @return 해당 닉네임을 가진 사용자 (없으면 null 반환)
  User findByNickName(String nickName);

  // id가 존재하는지 확인하는 메서드
  boolean existsById(String id);

  // nickName이 존재하는지 확인하는 메서드
  boolean existsByNickName(String nickName);
}
