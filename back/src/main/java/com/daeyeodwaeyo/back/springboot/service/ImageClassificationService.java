package com.daeyeodwaeyo.back.springboot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class ImageClassificationService {

  private final String FASTAPI_URL = "http://localhost:8001"; // FastAPI 서버 URL

  @Autowired
  private RestTemplate restTemplate;

  // 카테고리 예측을 위한 메서드
  public String predictCategory(MultipartFile image) throws IOException {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.MULTIPART_FORM_DATA);

    // MultiValueMap에 이미지 파일 추가
    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
    body.add("file", new HttpEntity<>(image.getResource(), headers));

    HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

    // FastAPI의 /predict 엔드포인트로 요청 전송
    ResponseEntity<String> response = restTemplate.exchange(FASTAPI_URL + "/predict", HttpMethod.POST, requestEntity, String.class);

    if (response.getStatusCode() == HttpStatus.OK) {
      return response.getBody();
    } else {
      throw new IOException("Error predicting category: " + response.getStatusCode());
    }

  }

  // 유사한 이미지 검색을 위한 메서드
  public String findSimilarImages(MultipartFile image, String folderPath) throws IOException {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.MULTIPART_FORM_DATA);

    Map<String, Object> body = new HashMap<>();
    body.put("file", image.getResource());
    body.put("folder_path", folderPath);

    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

    // FastAPI의 /similarity 엔드포인트로 요청 전송
    ResponseEntity<String> response = restTemplate.postForEntity(FASTAPI_URL + "/similarity", requestEntity, String.class);
    return response.getBody();
  }
}
