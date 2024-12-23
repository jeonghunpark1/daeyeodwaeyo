package com.daeyeodwaeyo.back.springboot.controller;

import com.daeyeodwaeyo.back.springboot.service.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/content")
public class ContentController {

  @Autowired
  private ContentService contentService;

  // 사진(프로필/상품 사진 또는 상품 동영상을 임시 폴더에 저장
//  @PostMapping("/tempContent")
//  public ResponseEntity<String> uploadTempContent(@RequestParam("file")MultipartFile file) throws IOException {
//    // 파일 확장자 확인(확장자를 통해 이미지와 동영상 파일을 구분)
//    String contentType = file.getContentType();
//
//    // 이미지 파일 처리
//    if (contentType != null && contentType.startsWith("image/")) {
//      String imageUrl = contentService.saveTempFile(file); // 파일 임시 저장 로직 호출
//      return ResponseEntity.ok(imageUrl);
//    }
//    // 동영상 파일 처리
//    else if (contentType != null && contentType.startsWith("video/")) {
//      String videoUrl = contentService.saveTempFile(file); // 파일 임시 저장 로직 호출
//      return ResponseEntity.ok(videoUrl);
//    }
//    else {
//      return ResponseEntity.badRequest().body("유효하지 않은 파일입니다.");
//    }
//  }

}
