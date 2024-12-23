package com.daeyeodwaeyo.back.springboot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  // 프로필 사진
  private String profileImageConnectPath = "/api/profileImagePath/**";
  private String profileImageResourcePath = "file:///opt/homebrew/var/www/resources/images/profileImage/";

  // 상품 이미지
  private String productImageConnectPath = "/api/productImagePath/**";
  private String productImageResourcePath = "file:///opt/homebrew/var/www/resources/images/productImage/";

  // 상품 동영상
  private String videoConnectPath = "/api/productVideoPath/**";
  private String productVideoResourcePath = "file:///opt/homebrew/var/www/resources/videos/productVideo/";

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // 모든 경로에 대해 CORS 허용
            .allowedOrigins("http://localhost:3000", "https://cub-living-endlessly.ngrok-free.app") // React 앱 도메인 허용
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
            .allowedHeaders("Authorization", "Content-Type", "Accept", "X-Requested-With") // 명시적인 요청 헤더
            .allowCredentials(true); // 인증 정보(쿠키 등 ) 허용
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // 프로필 사진에 대한 리소스 핸들러
    // 요청 URL : http://localhost:8080/imagePath/{filename}
    registry.addResourceHandler(profileImageConnectPath)
            .addResourceLocations(profileImageResourcePath);

    // 상품 사진에 대한 리소스 핸들러
    // 요청 URL : http://localhost:8080/productImagePath/{filename}
    registry.addResourceHandler(productImageConnectPath)
            .addResourceLocations(productImageResourcePath);

    // 상품 동영상에 대한 리소스 핸들러
    // 요청 URL : http://localhost:8080/productVideoPath/{filename}
    registry.addResourceHandler(videoConnectPath)
            .addResourceLocations(productVideoResourcePath);
  }
}
