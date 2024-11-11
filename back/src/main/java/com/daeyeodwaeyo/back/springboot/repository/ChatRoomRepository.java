package com.daeyeodwaeyo.back.springboot.repository;

import com.daeyeodwaeyo.back.springboot.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {

    Optional<ChatRoom> findByCreatorIdAndJoinerId(String creatorId, String joinerId);
    // 새로운 메서드: 사용자가 참여한 모든 채팅방 찾기
    @Query("SELECT c FROM ChatRoom c WHERE c.creatorId = :userId OR c.joinerId = :userId")
    List<ChatRoom> findByCreatorIdOrJoinerId(@Param("userId") String userId);
}
