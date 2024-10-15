package com.daeyeodwaeyo.back.springboot.service;

import com.daeyeodwaeyo.back.springboot.domain.Product;
import com.daeyeodwaeyo.back.springboot.domain.ProductImage;
import com.daeyeodwaeyo.back.springboot.domain.ProductVideo;
import com.daeyeodwaeyo.back.springboot.domain.User;
import com.daeyeodwaeyo.back.springboot.dto.ProductDTO;
import com.daeyeodwaeyo.back.springboot.repository.ProductImageRepository;
import com.daeyeodwaeyo.back.springboot.repository.ProductRepository;
import com.daeyeodwaeyo.back.springboot.repository.ProductVideoRepsitory;
import com.daeyeodwaeyo.back.springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
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

  private ProductDTO convertToDTO(Product product) {
    return new ProductDTO(
            product.getId(),
            product.getTitle(),
            product.getName(),
            product.getCategory(),
            product.getPrice(),
            product.getStartDate(),
            product.getEndDate(),
            product.getDescription()
    );
  }

  public List<ProductDTO> searchByQueryProducts(String query) {
    // 제목, 카테고리, 설명에 검색어가 포함된 상품들 조회
    List<Product> products = productRepository.findByTitleContainingOrCategoryContainingOrDescriptionContaining(query, query, query);
    // Product를 ProductDTO로 변환
    return products.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
  }
}
