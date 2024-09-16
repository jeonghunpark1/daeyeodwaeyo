package com.daeyeodwaeyo.back.springboot.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

//JwtRequestFilter는 Jwt 토큰을 요청해서 추출하여 검증하는 역할을 한다.
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private UserDetailsService userDetailsService;

//  필터 체인을 통해 요청을 처리하고 JWT 토큰을 검증한다.
//  @param request HTTP 요청
//  @param response HTTP 응답
//  @param chain 필터 체인
  @Override
  protected void doFilterInternal (HttpServletRequest request, HttpServletResponse response, FilterChain chain)
          throws ServletException, IOException {

    final String authorizationHeader = request.getHeader("Authorization");

    String username = null;
    String jwt = null;

    // 헤더에서 "Bearer "로 시작하는 JWT 토큰 추출
    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
      jwt = authorizationHeader.substring(7);
      username = jwtUtil.extractUsername(jwt); // 토큰에서 사용자 이름(아이디) 추출
    }

    // 사용자 이름이 존재하고, 아직 인증되지 않은 상태면 인증 처리
    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
      UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

      // 토큰이 유효한지 확인
      if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        usernamePasswordAuthenticationToken
                .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken); // 인증 성공
      }
    }
    chain.doFilter(request, response); // 다음 필터로 요청 전달
  }
}
