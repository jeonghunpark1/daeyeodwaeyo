package com.daeyeodwaeyo.back.springboot.service;

import com.daeyeodwaeyo.back.springboot.domain.User;
import com.daeyeodwaeyo.back.springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailService implements UserDetailsService {

  @Autowired
  private UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // 사용자의 아이디로 데이터를 조회하여 UserDetails를 반환
    User user = userRepository.findById(username)
            .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username));

    // User 엔티티를 스프링 시큐리티의 UserDetails로 변환하여 반환
    return org.springframework.security.core.userdetails.User.builder()
            .username(user.getId())
            .password(user.getPassword()) // 암호화된 비밀번호 사용
            .roles("USER") // 기본적인 역할 설정
            .build();
  }
}
