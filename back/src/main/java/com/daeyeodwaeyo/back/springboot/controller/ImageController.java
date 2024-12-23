package com.daeyeodwaeyo.back.springboot.controller;

import com.daeyeodwaeyo.back.springboot.domain.Product;
import com.daeyeodwaeyo.back.springboot.domain.ProductImage;
import com.daeyeodwaeyo.back.springboot.dto.SearchProductDTO;
import com.daeyeodwaeyo.back.springboot.repository.ProductRepository;
import com.daeyeodwaeyo.back.springboot.service.ImageService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/images")
public class ImageController {

  @Autowired
  private ImageService imageService;

  @Autowired
  private ProductRepository productRepository;

  private final String PRODUCT_IMAGE_PATH = "/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/resources/images/productImage";

  // 카테고리 예측 엔드포인트
  @PostMapping("/predict")
  public ResponseEntity<String> predictCategory(@RequestParam("file") MultipartFile file) {
    try {
      String result = imageService.predictCategory(file);
      return ResponseEntity.ok(result);
    } catch (HttpServerErrorException e) {
      // FastAPI에서 반환한 500 오류 처리
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Prediction service error: " + e.getMessage());
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing image for prediction");
    }
  }

  @PostMapping("/removeBg")
  public ResponseEntity<?> removeBg(@RequestParam("file") MultipartFile file) {
    try {
      return imageService.removeBackground(file);
    } catch (IOException e) {
      return ResponseEntity.status(500).body("Error removing background");
    }
  }

  // 유사한 이미지 검색 엔드포인트
  @PostMapping("/similarity")
  public ResponseEntity<List<SearchProductDTO>> findSimilarImages(@RequestParam("file") MultipartFile file,
                                                                  @RequestParam("category") String category,
                                                                  @RequestParam("name") String name) {
    try {
      // FastAPI로부터 유사 이미지 목록 가져오기
      String result = imageService.findSimilarImages(file);

      // JSON 형태의 문자열을 리스트로 변환
      ObjectMapper objectMapper = new ObjectMapper();
      Map<String, List<String>> resultMap = objectMapper.readValue(result, new TypeReference<Map<String, List<String>>>() {});
      List<String> imageNames = resultMap.get("similar_images");

      // 이미지 이름을 통해 ProductImage 엔티티에서 Product 검색
      List<Product> products = productRepository.findByImageNames(imageNames);

      // 중복 Product 제거하고, 순서 보장을 위해 LinkedHashMap 사용
      LinkedHashMap<String, Product> uniqueProducts = new LinkedHashMap<>();
      for (String imageName : imageNames) {
        for (Product product : products) {
          if (product.getImages().stream().anyMatch(img -> img.getImageUrl().equals(imageName))) {
            uniqueProducts.putIfAbsent(product.getId(), product);
          }
        }
      }

      // category와 name으로 필터링하여 Product 엔티티를 SearchProductDTO로 변환
      List<SearchProductDTO> productDTOs = uniqueProducts.values().stream()
              .filter(product -> product.getCategory().equalsIgnoreCase(category) && product.getName().equalsIgnoreCase(name))
              .map(product -> {
                List<String> imageUrls = product.getImages().stream()
                        .map(ProductImage::getImageUrl)
                        .collect(Collectors.toList());
                return new SearchProductDTO(
                        product.getId(),
                        product.getTitle(),
                        product.getName(),
                        product.getCategory(),
                        product.getPrice(),
                        product.getStartDate(),
                        product.getEndDate(),
                        imageUrls
                );
              })
              .collect(Collectors.toList());

      // DTO 리스트 반환
      return ResponseEntity.ok(productDTOs);
    } catch (IOException e) {
      return ResponseEntity.status(500).body(Collections.emptyList());
    }
  }




}
