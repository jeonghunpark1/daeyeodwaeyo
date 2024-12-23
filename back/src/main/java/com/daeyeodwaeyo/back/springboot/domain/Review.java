package com.daeyeodwaeyo.back.springboot.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Review {

    @Id
    @Column(length = 36, nullable = false, unique = true)
    private String id; // 리뷰 ID (Primary Key, UUID)

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false) // Product와 다대일 관계
    private Product product; // 상품 정보

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // User와 다대일 관계
    private User user; // 리뷰 작성자 정보

    @Column(name = "review_text", columnDefinition = "TEXT", nullable = false)
    private String reviewText; // 리뷰 내용

    @Column(nullable = false)
    private int rating; // 별점 (1~5)

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 작성 시간

    // 엔티티가 영속되기 전에 UUID 및 생성 시간 설정
    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString(); // UUID 생성
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now(); // 현재 시간 설정
        }
    }
}
