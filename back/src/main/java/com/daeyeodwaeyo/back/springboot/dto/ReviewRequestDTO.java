package com.daeyeodwaeyo.back.springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequestDTO {
    private String productId; // 상품 ID
    private String userId; // 리뷰 작성자 ID
    private String reviewText; // 리뷰 내용
    private int rating; // 별점 (1~5)
}
