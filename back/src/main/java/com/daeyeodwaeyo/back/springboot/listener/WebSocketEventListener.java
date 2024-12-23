package com.daeyeodwaeyo.back.springboot.listener;

import com.daeyeodwaeyo.back.springboot.dto.ChatMessageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component
public class WebSocketEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final Map<String, Set<String>> roomUserMap = new HashMap<>(); // 채팅방별 사용자 목록 관리

    public void addUserToRoom(String roomId, String userId) {
        System.out.println("WebSocketEventListener - 사용자가 채팅방에 입장 - Room ID: " + roomId + ", User ID: " + userId);
        roomUserMap.computeIfAbsent(roomId, k -> new HashSet<>()).add(userId);
    }

    public void removeUserFromRoom(String roomId, String userId) {
        Set<String> users = roomUserMap.get(roomId);
        if (users != null && users.remove(userId)) {
            System.out.println("사용자가 채팅방에서 나감 - Room ID: " + roomId + ", User ID: " + userId);
        } else {
            System.out.println("사용자가 채팅방에 없거나 이미 나갔습니다 - Room ID: " + roomId + ", User ID: " + userId);
        }
    }

    public boolean isUserInRoom(String roomId, String userId) {
        Set<String> users = roomUserMap.get(roomId);
        boolean isInRoom = users != null && users.contains(userId);
        System.out.println("isUserInRoom 호출 - Room ID: " + roomId + ", User ID: " + userId + ", Is in Room: " + isInRoom);
        return isInRoom;
    }

    // 특정 사용자에게 메시지를 전송하는 메서드
    public void broadcastToUser(String userId, ChatMessageDTO message) {
        System.out.println("Broadcasting to User - UserId: " + userId + ", ChatRoomId: " + message.getChatRoomId() +
                ", SenderUnreadCount: " + message.getUnreadCount() + ", ReceiverUnreadCount: " + message.getReceiverUnreadCount());
        messagingTemplate.convertAndSendToUser(userId, "/queue/messages", message);
    }
}
