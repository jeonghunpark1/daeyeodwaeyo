package com.daeyeodwaeyo.back.springboot.domain;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Transient;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
public class ChatRoom {

    @Id
    private String id = UUID.randomUUID().toString(); // UUID를 사용해 수동으로 ID 생성

    private String creatorId;
    private String joinerId;
    private String productId; // 상품 ID 추가

    // 현재 열려 있는 사용자 ID들을 저장할 Set
    @Transient
    private Set<String> openReceiverIds = new HashSet<>();

    public ChatRoom() {
    }

    public ChatRoom(String creatorId, String joinerId, String productId) {
        this.creatorId = creatorId;
        this.joinerId = joinerId;
        this.productId = productId; // productId 설정
    }
}
