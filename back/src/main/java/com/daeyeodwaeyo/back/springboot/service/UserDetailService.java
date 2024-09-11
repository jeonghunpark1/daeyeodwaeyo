package com.daeyeodwaeyo.back.springboot.service;

import com.daeyeodwaeyo.back.springboot.domain.User;
import com.daeyeodwaeyo.back.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserDetailService implements UserDetailsService {

  private final UserRepository userRepository;

  // 사용자 아이디(id)로 사용자의 정보를 가져오는 메서드
  @Override
  public User loadUserByUsername(String id) {
    return userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException((id)));
  }
}
