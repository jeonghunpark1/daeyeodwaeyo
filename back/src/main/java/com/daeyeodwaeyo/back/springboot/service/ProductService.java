package com.daeyeodwaeyo.back.springboot.service;

import com.daeyeodwaeyo.back.springboot.domain.Product;
import com.daeyeodwaeyo.back.springboot.domain.ProductImage;
import com.daeyeodwaeyo.back.springboot.domain.ProductVideo;
import com.daeyeodwaeyo.back.springboot.domain.User;
import com.daeyeodwaeyo.back.springboot.dto.*;
import com.daeyeodwaeyo.back.springboot.repository.ProductImageRepository;
import com.daeyeodwaeyo.back.springboot.repository.ProductRepository;
import com.daeyeodwaeyo.back.springboot.repository.ProductVideoRepository;
import com.daeyeodwaeyo.back.springboot.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

  private final String IMAGE_PATH = "C:\\Users\\p500w\\IdeaProjects\\daeyeodwaeyo 4\\daeyeodwaeyo\\resources\\images\\productImage";
  private final String VIDEO_PATH = "C:\\Users\\p500w\\IdeaProjects\\daeyeodwaeyo 4\\daeyeodwaeyo\\resources\\videos\\productVideo";

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private ProductImageRepository productImageRepository;

  @Autowired
  private ProductVideoRepository productVideoRepository;

  @Autowired
  private ContentService contentService;

  @Transactional
  public void createProduct(String userId, String productId, ProductDTO productDTO, List<MultipartFile> images, MultipartFile video) {
//    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//
//    LocalDate startDate = LocalDate.parse(productDTO.getStartDate(), formatter);
//    LocalDate endDate = LocalDate.parse(productDTO.getEndDate(), formatter);
    try {
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

      // 이미지 저장
      List<String> resultSaveProductImageNames = contentService.saveProductImage(images, product);
      if (resultSaveProductImageNames.isEmpty()) {
        throw new RuntimeException("Failed to save product images.");
      }

      // 비디오 저장
      String resultSaveProductVideoName = contentService.saveProductVideo(video, product);
      if (resultSaveProductVideoName.isEmpty()) {
        throw new RuntimeException("Failed to save product video.");
      }

      System.out.println("상품 저장 완료");

      // 트랜잭션이 성공적으로 완료되기 전의 작업
      TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
        @Override
        public void afterCommit() {
          // 트랜잭션 커밋 후에 실행할 작업
          System.out.println("Product created successfully: " + productId);
        }

        @Override
        public void afterCompletion(int status) {
          if (status == STATUS_ROLLED_BACK) {
            // 트랜잭션 롤백 후에 실행할 작업
            contentService.deleteProductImage(resultSaveProductImageNames);
            contentService.deleteProductVideo(resultSaveProductVideoName);
            System.err.println("Transaction rolled back for product: " + productId);
          }
        }
      });

    } catch (Exception e) {
      System.out.println("상품이 저장되지 않았습니다. / 트랜젝션 오류");
    }


//    // 상품 이미지 저장
//    for (MultipartFile image : images) {
//      String imageId = UUID.randomUUID().toString();
//      String imageName = imageId + "_" + image.getOriginalFilename();
//      File imageFile = new File(IMAGE_PATH, imageName);
//      try {
//        image.transferTo(imageFile);
//        System.out.println("save image name: " + imageName);
//        ProductImage productImage = new ProductImage();
//        productImage.setId(imageId);
//        productImage.setImageUrl(imageName);
//        productImage.setProduct(product);
//        productImageRepository.save(productImage);
//        System.out.println("이미지 저장 완료");
//      } catch (IOException e) {
//        throw new RuntimeException("Failed to store image", e);
//      }
//    }
//
//    // 비디오 저장
//    if (video != null) {
//      String videoId = UUID.randomUUID().toString();
//      String videoName = videoId + "_" + video.getOriginalFilename();
//      File videoFile = new File(VIDEO_PATH, videoName);
//      try {
//        video.transferTo(videoFile);
//        System.out.println("save video name: " + videoName);
//        ProductVideo productVideo = new ProductVideo();
//        productVideo.setId(videoId);
//        productVideo.setVideoUrl(videoName);
//        productVideo.setProduct(product);
//        productVideoRepository.save(productVideo);
//        System.out.println("비디오 저장 완료");
//      } catch (IOException e) {
//        throw new RuntimeException("Failed to store video", e);
//      }
//    }


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
    ProductVideo video = productVideoRepository.findByProduct(product);
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

  // name과 같은 모든 product의 price를 가져오는 메서드
  public List<Integer> getPricesByName(String name) {
    return productRepository.findPricesByName(name);
  }

  // shorts 페이지에서 product와 videoUrl 가져오는 메서드
  public List<ShortsDataDTO> getAllVideoInfos() {
    List<ProductVideo> productVideos = productVideoRepository.findAll();
    return productVideos.stream().map(productVideo -> {
      ShortsDataDTO shortsDataDTO = new ShortsDataDTO();
      shortsDataDTO.setId(productVideo.getProduct().getId());
      shortsDataDTO.setTitle(productVideo.getProduct().getTitle());
      shortsDataDTO.setName(productVideo.getProduct().getName());
      shortsDataDTO.setCategory(productVideo.getProduct().getCategory());
      shortsDataDTO.setVideoUrl(productVideo.getVideoUrl());
      return shortsDataDTO;
    }).collect(Collectors.toList());
  }

  // main 페이지에서 최신순으로 MainPageProductInfoDTO를 가져오는 메서드
  public List<MainPageProductInfoDTO> getLatesProducts(int limit) {
    return productRepository.findAll(PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt")))
            .getContent()
            .stream()
            .map(product -> new MainPageProductInfoDTO(
                    product.getId(),
                    product.getTitle(),
                    product.getName(),
                    product.getCategory(),
                    product.getImages().isEmpty()
                            ? null // 이미지가 없을 경우 null 반환
                            : product.getImages().get(0).getImageUrl() // 첫 번째 이미지만 반환
            ))
            .collect(Collectors.toList());
  }

  // 동영상을 전부 가져와서 무작위로 섞고 limit 수만큼 반환하는 메서드
  public List<ShortsDataDTO> getRandomShorts(int limit) {
    List<ProductVideo> allVideos = productVideoRepository.findAll();
    Collections.shuffle(allVideos); // 리스트를 무작위로 섞음
    return allVideos.stream()
            .limit(limit) // limit 수만큼 가져옴
            .map(video -> new ShortsDataDTO(
                    video.getProduct().getId(),
                    video.getProduct().getTitle(),
                    video.getProduct().getName(),
                    video.getProduct().getCategory(),
                    video.getVideoUrl()
            ))
            .collect(Collectors.toList());
  }

  // 마이페이지에서 내가 올린 상품의 정보를 가져와서 반환하는 메서드
  public List<MyProductDTO> getMyProducts(String userId) {
    // 사용자의 ID로 등록된 제품 조회
    return productRepository.findByUserId(userId)
            .stream()
            .map(product -> new MyProductDTO(
                    product.getId(),
                    product.getTitle(),
                    product.getCategory(),
                    product.getName(),
                    product.getImages().isEmpty()
                            ? null // 이미지가 없을 경우 null 반환
                            : product.getImages().get(0).getImageUrl() // 첫 번째 이미지만 반환
            ))
            .collect(Collectors.toList());
  }

  // 빌린 상품의 정보를 가져오는 메서드
  public List<MyProductDTO> getBorrowedProducts(List<String> productIds) {
    // productIds로 제품 조회
    return productRepository.findAllById(productIds)
            .stream()
            .map(product -> new MyProductDTO(
                    product.getId(),
                    product.getTitle(),
                    product.getCategory(),
                    product.getName(),
                    product.getImages().isEmpty()
                            ? null // 이미지가 없을 경우 null 반환
                            : product.getImages().get(0).getImageUrl() // 첫 번째 이미지만 반환
            ))
            .collect(Collectors.toList());
  }


  @Transactional
  public void deleteProduct(String productId) {
    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid product ID: " + productId));

    List<String> imageNames = new ArrayList<>();
    List<ProductImage> productImage;
    String videoName = null;

    try {
      productImage = productImageRepository.findByProduct(product);

      for (ProductImage productimage : productImage) {
        imageNames.add(productimage.getImageUrl());
      }
    } catch (Exception e) {
      System.out.println("등록된 사진이 없습니다.");
    }

    try {
      ProductVideo productVideo = productVideoRepository.findByProduct(product);
      videoName = productVideo.getVideoUrl();
    } catch (Exception e) {
      System.out.println("등록된 동영상이 없습니다.");
    }

    productRepository.delete(product);
    // 트랜잭션이 성공적으로 완료되기 전의 작업
    String finalVideoName = videoName;
    TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
      @Override
      public void afterCommit() {
        // 트랜잭션 커밋 후에 실행할 작업
        contentService.deleteProductImage(imageNames);
        if (finalVideoName != null) {
          contentService.deleteProductVideo(finalVideoName);
        }
        System.out.println("Product removed successfully: " + productId);
      }

      @Override
      public void afterCompletion(int status) {
        if (status == STATUS_ROLLED_BACK) {
          // 트랜잭션 롤백 후에 실행할 작업
          System.err.println("Transaction rolled back for product: " + productId);
        }
      }
    });
  }
}
