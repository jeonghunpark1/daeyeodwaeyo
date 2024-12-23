package com.daeyeodwaeyo.back.springboot.service;

import com.daeyeodwaeyo.back.springboot.domain.User;
import com.daeyeodwaeyo.back.springboot.domain.Product;
import com.daeyeodwaeyo.back.springboot.domain.Review;
import com.daeyeodwaeyo.back.springboot.dto.ReviewRequestDTO;
import com.daeyeodwaeyo.back.springboot.dto.ReviewResponseDTO;
import com.daeyeodwaeyo.back.springboot.repository.ReviewRepository;
import com.daeyeodwaeyo.back.springboot.repository.UserRepository;
import com.daeyeodwaeyo.back.springboot.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class); // Logger 추가

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // 리뷰 저장
    public ReviewResponseDTO saveReview(ReviewRequestDTO requestDTO) {
        // Product 존재 여부 확인 및 가져오기
        Product product = productRepository.findById(requestDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        // User 존재 여부 확인 및 가져오기
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // Review 객체 생성 및 설정
        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setReviewText(requestDTO.getReviewText());
        review.setRating(requestDTO.getRating());

        // Review 저장
        Review savedReview = reviewRepository.save(review);

        // 저장된 Review를 ResponseDTO로 변환 후 반환
        return mapToResponseDTO(savedReview);
    }

    // ResponseDTO로 매핑
    private ReviewResponseDTO mapToResponseDTO(Review review) {
        ReviewResponseDTO responseDTO = new ReviewResponseDTO();
        responseDTO.setReviewId(review.getId());
        responseDTO.setProductId(review.getProduct().getId());
        responseDTO.setUserId(review.getUser().getId());
        responseDTO.setReviewText(review.getReviewText());
        responseDTO.setRating(review.getRating());
        responseDTO.setCreatedAt(review.getCreatedAt());
        return responseDTO;
    }

    // 특정 사용자와 상품에 대한 리뷰 존재 여부 확인
    public boolean isReviewExist(String productId, String userId) {
        return reviewRepository.existsByProductIdAndUserId(productId, userId);
    }

    // 특정 상품 ID로 리뷰 목록 가져오기
    public List<ReviewResponseDTO> getReviewsByProductId(String productId) {
        logger.info("Fetching reviews for productId: {}", productId);

        List<Review> reviews = reviewRepository.findAllByProductId(productId);

        if (reviews.isEmpty()) {
            logger.info("No reviews found for productId: {}", productId);
        } else {
            logger.info("Found {} reviews for productId: {}", reviews.size(), productId);
        }

        return reviews.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
}
