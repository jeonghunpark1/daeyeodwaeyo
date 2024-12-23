package com.daeyeodwaeyo.back.springboot.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageDTO {

    private String chatRoomId;
    private String senderId;
    private String receiverId; // receiverId 필드 추가
    private String content;
    private LocalDateTime timestamp;
    private long unreadCount;  // unreadCount 필드 추가
    private long receiverUnreadCount; // 받는 사람의 unreadCount

    // 기본 생성자
    public ChatMessageDTO() {}

    // 모든 필드를 포함하는 생성자
    public ChatMessageDTO(String chatRoomId, String senderId, String content, LocalDateTime timestamp, long unreadCount,long receiverUnreadCount) {
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
        this.content = content;
        this.timestamp = timestamp;
        this.unreadCount = unreadCount;
        this.receiverUnreadCount = receiverUnreadCount;
    }

    // unreadCount 없이 사용하는 생성자
    public ChatMessageDTO(String chatRoomId, String senderId, String content, LocalDateTime timestamp) {
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
        this.content = content;
        this.timestamp = timestamp;
    }
}
