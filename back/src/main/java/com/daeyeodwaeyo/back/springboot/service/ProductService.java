package com.daeyeodwaeyo.back.springboot.service;

import com.daeyeodwaeyo.back.springboot.domain.Product;
import com.daeyeodwaeyo.back.springboot.domain.ProductImage;
import com.daeyeodwaeyo.back.springboot.domain.ProductVideo;
import com.daeyeodwaeyo.back.springboot.domain.User;
import com.daeyeodwaeyo.back.springboot.dto.ProductDTO;
import com.daeyeodwaeyo.back.springboot.dto.ProductDetailDTO;
import com.daeyeodwaeyo.back.springboot.dto.SearchProductDTO;
import com.daeyeodwaeyo.back.springboot.repository.ProductImageRepository;
import com.daeyeodwaeyo.back.springboot.repository.ProductRepository;
import com.daeyeodwaeyo.back.springboot.repository.ProductVideoRepsitory;
import com.daeyeodwaeyo.back.springboot.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

  private final String IMAGE_PATH = "/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/resources/images/productImage";
  private final String VIDEO_PATH = "/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/resources/videos/productVideo";

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private ProductImageRepository productImageRepository;

  @Autowired
  private ProductVideoRepsitory productVideoRepsitory;

  @Transactional
  public void createProduct(String userId, String productId, ProductDTO productDTO, List<MultipartFile> images, MultipartFile video) {
//    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//
//    LocalDate startDate = LocalDate.parse(productDTO.getStartDate(), formatter);
//    LocalDate endDate = LocalDate.parse(productDTO.getEndDate(), formatter);

    // Product 엔티티 생성
    Product product = new Product();
    product.setId(productId);
    product.setTitle(productDTO.getTitle());
    product.setName(productDTO.getName());
    product.setCategory(productDTO.getCategory());
    product.setPrice(productDTO.getPrice());
    product.setStartDate(productDTO.getStartDate());
    product.setEndDate(productDTO.getEndDate());
    product.setDescription(productDTO.getDescription());

    // 사용자 ID 설정
    User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
    product.setUser(user);

    // 상품 저장
    productRepository.save(product);

    // 상품 이미지 저장
    for (MultipartFile image : images) {
      String imageId = UUID.randomUUID().toString();
      String imageName = imageId + "_" + image.getOriginalFilename();
      File imageFile = new File(IMAGE_PATH, imageName);
      try {
        image.transferTo(imageFile);
        System.out.println("save image name: " + imageName);
        ProductImage productImage = new ProductImage();
        productImage.setId(imageId);
        productImage.setImageUrl(imageName);
        productImage.setProduct(product);
        productImageRepository.save(productImage);
        System.out.println("이미지 저장 완료");
      } catch (IOException e) {
        throw new RuntimeException("Failed to store image", e);
      }
    }

    // 비디오 저장
    if (video != null) {
      String videoId = UUID.randomUUID().toString();
      String videoName = videoId + "_" + video.getOriginalFilename();
      File videoFile = new File(VIDEO_PATH, videoName);
      try {
        video.transferTo(videoFile);
        System.out.println("save video name: " + videoName);
        ProductVideo productVideo = new ProductVideo();
        productVideo.setId(videoId);
        productVideo.setVideoUrl(videoName);
        productVideo.setProduct(product);
        productVideoRepsitory.save(productVideo);
        System.out.println("비디오 저장 완료");
      } catch (IOException e) {
        throw new RuntimeException("Failed to store video", e);
      }
    }

    System.out.println("상품 저장 완료");
  }

  private SearchProductDTO convertToDTO(Product product) {
    // 해당 상품과 연관된 이미지 조회
    List<ProductImage> images = productImageRepository.findByProduct(product);
    List<String> imageUrls = images.stream()
                                   .map(ProductImage::getImageUrl) // 이미지 URL만 추출
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
  }

  public List<SearchProductDTO> searchByQueryProducts(String query, String type) {
    List<Product> products = new ArrayList<>();
    // 제목, 카테고리, 설명에 검색어가 포함된 상품들 조회
    if (type.equals("orderByLatest")) {
      products = productRepository.findByTitleContainingOrNameContainingOrCategoryContainingOrDescriptionContainingOrderByCreatedAtDesc(query, query, query, query);
      System.out.println("최신순");
    }
    else if (type.equals("orderByLook")) {
      products = productRepository.findByTitleContainingOrNameContainingOrCategoryContainingOrDescriptionContainingOrderByCreatedAtDesc(query, query, query, query);
      System.out.println("조회순");
    }
    else if (type.equals("orderByLike")) {
      products = productRepository.findByTitleContainingOrNameContainingOrCategoryContainingOrDescriptionContainingOrderByCreatedAtDesc(query, query, query, query);
      System.out.println("좋아요순");
    }
    else if (type.equals("orderByHighPrice")) {
      products = productRepository.findByTitleContainingOrNameContainingOrCategoryContainingOrDescriptionContainingOrderByPriceDesc(query, query, query, query);
      System.out.println("높은가격순");
    }
    else if (type.equals("orderByLowPrice")) {
      products = productRepository.findByTitleContainingOrNameContainingOrCategoryContainingOrDescriptionContainingOrderByPriceAsc(query, query, query, query);
      System.out.println("낮은가격순");
    }
    // Product를 ProductDTO로 변환
    return products.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
  }

  public ProductDetailDTO getProductDetailById(String productId) {
    Product product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));

    // 해당 상품과 연관된 이미지 조회
    List<ProductImage> images = productImageRepository.findByProduct(product);
    List<String> imageUrls = images.stream()
            .map(ProductImage::getImageUrl) // 이미지 URL만 추출
            .collect(Collectors.toList());

    // 해당 상품과 연관된 비디오 조회
    ProductVideo video = productVideoRepsitory.findByProduct(product);
    String videoUrl = video != null ? video.getVideoUrl() : null;

    ProductDetailDTO productDetailDTO = new ProductDetailDTO();

    productDetailDTO.setId(product.getId());
    productDetailDTO.setTitle(product.getTitle());
    productDetailDTO.setName(product.getName());
    productDetailDTO.setCategory(product.getCategory());
    productDetailDTO.setPrice(product.getPrice());
    productDetailDTO.setStartDate(product.getStartDate());
    productDetailDTO.setEndDate(product.getEndDate());
    productDetailDTO.setDescription(product.getDescription());
    productDetailDTO.setCreatedAt(product.getCreatedAt());
    productDetailDTO.setWriterId(product.getUser().getId()); // User 객체의 ID만 설정
    productDetailDTO.setImageUrls(imageUrls);
    productDetailDTO.setVideoUrl(videoUrl);
    return productDetailDTO;
  }
}
