package com.daeyeodwaeyo.back.springboot.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String chatRoomId;
    private String senderId;
    private String content;
    private LocalDateTime timestamp;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE") // 기본값 설정
    private Boolean isRead = false; // 기본값 false로 설정

    public ChatMessage() {
    }

    public ChatMessage(String chatRoomId, String senderId, String content, LocalDateTime timestamp) {
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
        this.content = content;
        this.timestamp = timestamp;
        this.isRead = false;
    }
}
