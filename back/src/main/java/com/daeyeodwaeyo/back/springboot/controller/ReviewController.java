package com.daeyeodwaeyo.back.springboot.controller;

import com.daeyeodwaeyo.back.springboot.dto.ReviewRequestDTO;
import com.daeyeodwaeyo.back.springboot.dto.ReviewResponseDTO;
import com.daeyeodwaeyo.back.springboot.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // 리뷰 저장
    @PostMapping
    public ResponseEntity<ReviewResponseDTO> saveReview(@RequestBody ReviewRequestDTO requestDTO) {
        ReviewResponseDTO savedReview = reviewService.saveReview(requestDTO);
        return ResponseEntity.ok(savedReview);
    }
    @GetMapping("/check")
    public boolean checkReviewExists(
            @RequestParam("productId") String productId,
            @RequestParam("userId") String userId) {
        return reviewService.isReviewExist(productId, userId);
    }
    // 특정 상품 ID로 리뷰 가져오기
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByProductId(@PathVariable String productId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }


}
