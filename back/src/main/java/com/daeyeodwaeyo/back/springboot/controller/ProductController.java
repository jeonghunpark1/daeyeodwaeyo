package com.daeyeodwaeyo.back.springboot.controller;

import com.daeyeodwaeyo.back.springboot.dto.ProductDTO;
import com.daeyeodwaeyo.back.springboot.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

  @Autowired
  private ProductService productService;

  @PostMapping
  public ResponseEntity<String> addProduct( @ModelAttribute ProductDTO productDTO,
                                            @RequestPart("images") List<MultipartFile> images,
                                            @RequestPart(value = "video", required = false) MultipartFile video,
                                            Authentication authentication) throws IOException {
//    // DTO에 데이터를 직접 매핑
//
//    @RequestPart("title") String title,
//    @RequestPart("name") String name,
//    @RequestPart("category") String category,
//    @RequestPart("price") BigDecimal price,
//    @RequestPart("startDate") LocalDateTime startDate,
//    @RequestPart("endDate") LocalDateTime endDate,
//    @RequestPart("description") String description,
//
//    AddProductDTO addProductDTO = new AddProductDTO();
//    addProductDTO.setTitle(title);
//    addProductDTO.setName(name);
//    addProductDTO.setCategory(category);
//    addProductDTO.setPrice(price);
//    addProductDTO.setStartDate(startDate);
//    addProductDTO.setEndDate(endDate);
//    addProductDTO.setDescription(description);

    // 현재 로그인한 사용자의 ID 가져오기
    String userId = authentication.getName(); // 사용자 인증 정보를 통해 ID 가져오기

    System.out.println("userId: " + userId);

    String productId = UUID.randomUUID().toString();
    productService.createProduct(userId, productId, productDTO, images, video);
    return ResponseEntity.ok("Product created successfully.");
  }
}
