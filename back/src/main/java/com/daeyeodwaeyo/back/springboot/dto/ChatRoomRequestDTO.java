package com.daeyeodwaeyo.back.springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRoomRequestDTO {

    private String creatorId;  // 생성자의 ID
    private String joinerId;   // 참여자의 ID

    // 기본 생성자
    public ChatRoomRequestDTO() {}

    // 매개변수 있는 생성자
    public ChatRoomRequestDTO(String creatorId, String joinerId) {
        this.creatorId = creatorId;
        this.joinerId = joinerId;
    }
}
