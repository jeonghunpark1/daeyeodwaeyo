package com.daeyeodwaeyo.back.springboot.controller;

import com.daeyeodwaeyo.back.springboot.domain.Product;
import com.daeyeodwaeyo.back.springboot.dto.*;
import com.daeyeodwaeyo.back.springboot.repository.ProductRepository;
import com.daeyeodwaeyo.back.springboot.service.ContentService;
import com.daeyeodwaeyo.back.springboot.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private ContentService contentService;

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

  // query로 검색을 요청하면 그에 맞는 물건 리스트 반환
  @GetMapping("/searchByQuery")
  public ResponseEntity<List<SearchProductDTO>> searchByQueryProducts(@RequestParam("query") String query, @RequestParam("type") String type) {
    List <SearchProductDTO> products = productService.searchByQueryProducts(query, type);
    return ResponseEntity.ok(products);
  }

  // 물건 검색 후 원하는 물건 클릭 시 물건 상세 정보 반환
  @GetMapping("/detailInfo")
  public ResponseEntity<ProductDetailDTO> productDetailInfo(@RequestParam("productId") String productId) {
    ProductDetailDTO productDetail = productService.getProductDetailById(productId);
    return ResponseEntity.ok(productDetail);
  }

  // name에 해당하는 모든 product의 price를 리스트로 반환
  @GetMapping("/prices")
  public List<Integer> getPricesByName(@RequestParam String name) {
    return productService.getPricesByName(name);
  }

  // 저장된 동영상을 전부 가져와서 shorts 페이지에서 보여주는 메서드
  @GetMapping("/shorts")
  public List<ShortsDataDTO> getShortsInfo() {
    return productService.getAllVideoInfos();
  }

  // 제일 최근에 등록된 상품 게시물 3개를 가져와서 main 페이지에서 보여주는 메서드
  @GetMapping("mainLatestProduct")
  public List<MainPageProductInfoDTO> getLatestProducts() {
    return productService.getLatesProducts(3); // 최신 3개의 제품 정보 반환
  }

  // 저장된 동영상 3개를 랜덤하게 가져와서 main 페이지에서 보여주는 메서드
  @GetMapping("/mainShorts")
  public List<ShortsDataDTO> getMainShorts() {
    return productService.getRandomShorts(3); // 랜덤한 3개의 동영상 정보 반환
  }

  // 마이페이지에서 내가 등록한 상품의 정보를 가져오는 메서드
  @GetMapping("/myProduct")
  public List<MyProductDTO> getMyProducts(Authentication authentication) {
    String userId = authentication.getName(); // 사용자 인증 정보를 통해 ID 가져오기
    return productService.getMyProducts(userId);
  }

  // 상품 상세 페이지에서 상품을 삭제(내 상품일 경우)하는 메서드
  @DeleteMapping("/remove/{productId}")
  public ResponseEntity<String> removeProduct(@PathVariable String productId) {
    try {
      productService.deleteProduct(productId);
      return ResponseEntity.ok("Product removed successfully");
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to remove product.");
    }
  }
}
