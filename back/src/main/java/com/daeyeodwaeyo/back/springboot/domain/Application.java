package com.daeyeodwaeyo.back.springboot.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Application {

    @Id
    private String applicationId; // 기본 키

    @ManyToOne
    @JoinColumn(name = "chatRoomId", nullable = false) // ChatRoom과 다대일 관계
    private ChatRoom chatRoom;

    @Column(nullable = false)
    private LocalDate startDate; // 대여 시작 날짜

    @Column(nullable = false)
    private LocalDate endDate; // 대여 종료 날짜

    @Column(nullable = false)
    private String price; // 대여 가격

    @Column(nullable = false)
    private String location; // 거래 장소

    @ManyToOne
    @JoinColumn(name = "applicant") // User 테이블과 매핑 (신청자)
    private User applicant;

    @ManyToOne
    @JoinColumn(name = "lenderId") // User 테이블과 매핑 (대여자)
    private User lender;

    @Column(nullable = false)
    private String status = "PENDING"; // 기본 상태값

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now(); // 생성 날짜
}
