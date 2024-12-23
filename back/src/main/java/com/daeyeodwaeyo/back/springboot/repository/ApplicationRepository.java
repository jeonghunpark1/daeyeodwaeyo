package com.daeyeodwaeyo.back.springboot.repository;

import com.daeyeodwaeyo.back.springboot.domain.Application;
import com.daeyeodwaeyo.back.springboot.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {
    // 특정 채팅방에 속한 신청서를 가져오는 메서드
    List<Application> findByChatRoomId(String chatRoomId);
    boolean existsByChatRoom(ChatRoom chatRoom);
    List<Application> findByApplicantIdOrLenderId(String applicantId, String lenderId);

    List<Application> findByApplicant_IdAndStatus(String applicantId, String status);
}
