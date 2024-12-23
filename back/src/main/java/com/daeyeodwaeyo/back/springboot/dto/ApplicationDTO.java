package com.daeyeodwaeyo.back.springboot.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ApplicationDTO {

    private String applicationId; // 신청 ID
    private String chatRoomId;    // 채팅방 ID
    private LocalDate startDate; // 대여 시작 날짜
    private LocalDate endDate;   // 대여 종료 날짜
    private String price;         // 대여 가격
    private String location;      // 거래 장소
    private String applicantId;   // 신청자 ID
    private String lenderId;      // 대여자 ID
    private String status;        // 상태 (예: PENDING, APPROVED)
    private LocalDateTime createdAt; // 생성 날짜
}
