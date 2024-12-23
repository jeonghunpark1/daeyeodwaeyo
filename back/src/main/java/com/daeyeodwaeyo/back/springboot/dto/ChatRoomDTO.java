package com.daeyeodwaeyo.back.springboot.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatRoomDTO {

    private String chatRoomId;
    private String creatorId;
    private String joinerId;
    private String lastMessage;
    private LocalDateTime lastMessageTimestamp; // LocalDateTime으로 설정
    private String joinerNickname;       // 상대방 닉네임
    private String joinerProfileImage;   // 상대방 프로필 이미지 파일명
    private long unreadCount;  // 안 읽은 메시지 개수 필드 추가

    // 기본 생성자
    public ChatRoomDTO() {
    }

    // 모든 필드를 초기화하는 생성자
    public ChatRoomDTO(String chatRoomId, String creatorId, String joinerId, String lastMessage, LocalDateTime lastMessageTimestamp,
                       String joinerNickname, String joinerProfileImage, int unreadCount) { // unreadCount 추가
        this.chatRoomId = chatRoomId;
        this.creatorId = creatorId;
        this.joinerId = joinerId;
        this.lastMessage = lastMessage;
        this.lastMessageTimestamp = lastMessageTimestamp;
        this.joinerNickname = joinerNickname;
        this.joinerProfileImage = joinerProfileImage;
        this.unreadCount = unreadCount; // unreadCount 초기화
    }
}
