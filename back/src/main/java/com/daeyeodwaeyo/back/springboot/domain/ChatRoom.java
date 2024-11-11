package com.daeyeodwaeyo.back.springboot.domain;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

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
    // 현재 열려 있는 사용자 ID들을 저장할 Set

    @ElementCollection
    private Set<String> openReceiverIds = new HashSet<>();
    public ChatRoom() {
    }

    public ChatRoom(String creatorId, String joinerId) {
        this.creatorId = creatorId;
        this.joinerId = joinerId;
    }
}
