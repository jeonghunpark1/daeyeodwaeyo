package com.daeyeodwaeyo.back.springboot.repository;

import com.daeyeodwaeyo.back.springboot.domain.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // chatRoomId로 메시지를 시간순 정렬 조회
    List<ChatMessage> findByChatRoomIdOrderByTimestampAsc(String chatRoomId);

    // 최신 메시지 조회 (채팅방별 최신 메시지 하나 가져오기)
    Optional<ChatMessage> findTopByChatRoomIdOrderByTimestampDesc(String chatRoomId);

    // 안 읽은 메시지 개수 조회 (특정 채팅방에서 특정 사용자가 읽지 않은 메시지)
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.chatRoomId = :chatRoomId AND m.isRead = false AND m.senderId <> :userId")
    long countByChatRoomIdAndIsReadFalseAndSenderIdNot(@Param("chatRoomId") String chatRoomId, @Param("userId") String userId);
// ChatMessageRepository.java

    List<ChatMessage> findByChatRoomIdAndIsReadFalseAndSenderIdNot(String chatRoomId, String senderId);
}
