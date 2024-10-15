package com.daeyeodwaeyo.back.springboot.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

//SecurityConfig는 스프링 시큐리티 설정을 담당하는 클래스다.
//JWT 필터를 적용하고 경로에 따른 접근 권한을 설정한다.
@EnableWebSecurity
@Configuration
public class SecurityConfig {

  private final JwtRequestFilter jwtRequestFilter;

  public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
    this.jwtRequestFilter = jwtRequestFilter;
  }

//  스프링 시큐리티 설정을 정의하는 메서드
//  @param http HTTP 보안 설정
//  @return SecurityFilterChain
//  @throws Exception

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws  Exception {
    http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // 명시적으로 CORS 설정 적용
            .csrf(AbstractHttpConfigurer::disable) // CSRF 비활성화 (JWT는 CSRF 보호가 필요하지 않음)
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/users/signup",
                                     "/api/users/idDuplicate",
                                     "/api/users/nickNameDuplicate",
                                     "/api/users/findId",
                                     "/api/users/findPassword",
                                     "/api/email/**",
                                     "/api/users/login",
                                     "/api/content/tempContent",
                                     "/api/products/searchByQuery",
                                     "/imagePath/**",
                                     "/productImagePath/**",
                                     "/videoPath/**").permitAll() // 회원가입과 로그인은 인증 없이 접근 가능
                    .requestMatchers("/api/products").authenticated() // 인증된 사용자만 접근 가능
                    .anyRequest().authenticated()) // 그 외 모든 요청은 인증 필요
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션을 사용하지 않음 (JWT 방식)
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class); // JWT 필터를 UsernamePasswordAuthenticationFilter 전에 실행하도록 설정

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:3000")); // 허용할 도메인 명시
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "X-Requested-With"));
    configuration.setAllowCredentials(true);
    configuration.setExposedHeaders(List.of("Authorization")); // 필요한 경우 노출할 헤더 설정


    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

//  @Bean
//  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//    // CSRF(Cross-site request forgery) 비활성화 설정 및 cors 설정
//    http.csrf(csrf -> csrf.disable())
//            .cors(cors -> cors.configurationSource(corsConfigurationSource()));
//
//    // Session 비활성화
//    http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//
//    // Request에 대한 인증/인가
//    http.authorizeHttpRequests(auth -> auth
//            .requestMatchers("/api/users/signup", "api/users/login").permitAll()
//            .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
//            .anyRequest().authenticated());
//
//    // 필터 등록
//    http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
//
//    return http.build();
//  }
//
//  @Bean
//  CorsConfigurationSource corsConfigurationSource() {
//    CorsConfiguration configuration = new CorsConfiguration();
//    configuration.addAllowedOrigin("http://localhost:3000");
//
//    // 예비 요청 - 본 요청 프론트와의 트러블 슈팅
//    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT")); // 허용할 Http Method
//    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));
//    configuration.setAllowCredentials(true);
//    configuration.setMaxAge(3600L);
//    configuration.addExposedHeader("authorization");
//    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//    source.registerCorsConfiguration("api/**", configuration);
//    return source;
//  }

//  BCryptPasswordEncoder를 사용하여 비밀번호 암호화
//  @return PasswordEncoder
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

//  AuthenticationManager 빈을 생성하여 스프링 시쿠리티에서 인증 처리에 사용
//  @return AuthenticationManager
//  @throws Exception
  @Bean
  public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
    return http.getSharedObject(AuthenticationManagerBuilder.class).build();
  }
}
