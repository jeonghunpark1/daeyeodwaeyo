package com.daeyeodwaeyo.back.springboot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  private String connectPath = "/imagePath/**";
  private String resourcePath = "file:///Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/resources/images/profileImage/";

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // 모든 경로에 대해 CORS 허용
            .allowedOrigins("http://localhost:3000") // React 앱 도메인 허용
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
            .allowedHeaders("Content-Type", "Authorization", "Accept") // 명시적인 요청 헤더
            .allowCredentials(true); // 인증 정보(쿠키 등 ) 허용
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler(connectPath)
            .addResourceLocations(resourcePath);
  }
}
