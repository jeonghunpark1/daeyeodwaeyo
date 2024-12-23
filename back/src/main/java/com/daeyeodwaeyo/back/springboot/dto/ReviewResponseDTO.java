package com.daeyeodwaeyo.back.springboot.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter

public class ReviewResponseDTO {
    private String reviewId; // 리뷰 ID
    private String productId; // 상품 ID
    private String userId; // 리뷰 작성자 ID
    private String reviewText; // 리뷰 내용
    private int rating; // 별점
    private LocalDateTime createdAt; // 작성 시간
}
