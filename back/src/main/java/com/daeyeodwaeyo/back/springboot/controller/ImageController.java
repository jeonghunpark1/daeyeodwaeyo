package com.daeyeodwaeyo.back.springboot.controller;

import com.daeyeodwaeyo.back.springboot.service.ImageClassificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/images")
public class ImageController {

  @Autowired
  private ImageClassificationService imageClassificationService;

  private final String PRODUCT_IMAGE_PATH = "/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/resources/images/productImage";

  // 카테고리 예측 엔드포인트
  @PostMapping("/predict")
  public ResponseEntity<String> predictCategory(@RequestParam("file") MultipartFile file) {
    try {
      String result = imageClassificationService.predictCategory(file);
      return ResponseEntity.ok(result);
    } catch (IOException e) {
      return ResponseEntity.status(500).body("Error processing image for prediction");
    }

  }

  // 유사한 이미지 검색 엔드포인트
  @PostMapping("/similarity")
  public ResponseEntity<String> findSimilarImages(@RequestParam("file") MultipartFile file) {
    try {
      String result = imageClassificationService.findSimilarImages(file, PRODUCT_IMAGE_PATH);
      return ResponseEntity.ok(result);
    } catch (IOException e) {
      return ResponseEntity.status(500).body("Error finding similar images");
    }
  }
}
