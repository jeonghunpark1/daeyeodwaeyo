package com.daeyeodwaeyo.back.springboot;

import com.daeyeodwaeyo.back.springboot.service.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@EnableScheduling
@org.springframework.boot.autoconfigure.SpringBootApplication
public class SpringBootApplication {

  @Autowired
  private ContentService contentService;

  public static void main(String[] args) {
    SpringApplication.run(SpringBootApplication.class, args);
  }

  // 일정 시간마다 임시 이미지 삭제
  @Scheduled(cron = "0 0 2 * * ?") // 매일 새벽 2시에 실행
  public void cleanUpTempImages() {
//
//    userService.cleanUpTempImages();
//
    contentService.cleanUpTempFiles();
  }
}
