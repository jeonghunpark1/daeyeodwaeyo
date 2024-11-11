package com.daeyeodwaeyo.back.springboot.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chatparticipation")
public class ChatParticipation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "chat_participation_id")
    private String chatParticipationId;  // String으로 변경

    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt = LocalDateTime.now();

    // Getters and Setters
    public String getChatParticipationId() {
        return chatParticipationId;
    }



    public ChatRoom getChatRoom() {
        return chatRoom;
    }

    public void setChatRoom(ChatRoom chatRoom) {
        this.chatRoom = chatRoom;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
