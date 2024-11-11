package com.daeyeodwaeyo.back.springboot.controller;

import com.daeyeodwaeyo.back.springboot.config.JwtUtil;
import com.daeyeodwaeyo.back.springboot.domain.User;
import com.daeyeodwaeyo.back.springboot.dto.ChatRoomRequestDTO;
import com.daeyeodwaeyo.back.springboot.dto.ChatRoomResponseDTO;
import com.daeyeodwaeyo.back.springboot.dto.ChatMessageDTO;
import com.daeyeodwaeyo.back.springboot.dto.ChatRoomDTO;
import com.daeyeodwaeyo.back.springboot.domain.ChatRoom;
import com.daeyeodwaeyo.back.springboot.domain.ChatMessage;
import com.daeyeodwaeyo.back.springboot.repository.UserRepository;
import com.daeyeodwaeyo.back.springboot.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/Chat")
public class ChatController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

//    @PostMapping("/findOrCreateRoom")
//    public ResponseEntity<ChatRoomResponseDTO> findOrCreateRoom(@RequestBody ChatRoomRequestDTO request) {
//        ChatRoom chatRoom = chatService.findOrCreateRoom(request.getCreatorId(), request.getJoinerId());
//        logger.info("findOrCreateRoom - 생성된 채팅방 ID: {}", chatRoom.getId());
//        return ResponseEntity.ok(new ChatRoomResponseDTO(chatRoom.getId()));
//    }

    @PostMapping("/findOrCreateRoom")
    public ResponseEntity<ChatRoomResponseDTO> findOrCreateRoom(@RequestBody Map<String, String> joinerId,
                                                                @RequestHeader("Authorization") String token) {
        // 토큰에서 사용자 정보 추출
        String userId = jwtUtil.extractUsername(token.substring(7)); // "Bearer " 부분 제거
        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("아이디가 존재하지 않습니다."));
        String creatorId = user.getId();

        ChatRoom chatRoom = chatService.findOrCreateRoom(joinerId.get("joinerId"), creatorId);
        logger.info("findOrCreateRoom - 생성된 채팅방 ID: {}", chatRoom.getId());
        return ResponseEntity.ok(new ChatRoomResponseDTO(chatRoom.getId()));
    }

    @GetMapping("/messages/{chatRoomId}")
    public ResponseEntity<List<ChatMessageDTO>> getMessages(@PathVariable String chatRoomId) {
        List<ChatMessageDTO> messages = chatService.getMessages(chatRoomId);
        logger.info("getMessages - 채팅방 ID: {}, 메시지 수: {}", chatRoomId, messages.size());
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/send")
    public ResponseEntity<ChatMessageDTO> sendMessage(@RequestBody ChatMessageDTO messageDTO) {
        ChatMessage savedMessage = chatService.saveMessage(messageDTO);

        long senderUnreadCount = chatService.calculateUnreadMessages(messageDTO.getChatRoomId(), messageDTO.getSenderId());
        String receiverId = chatService.getRecipientId(messageDTO.getChatRoomId(), messageDTO.getSenderId());
        long receiverUnreadCount = chatService.calculateUnreadMessages(messageDTO.getChatRoomId(), receiverId);

        ChatMessageDTO responseMessage = new ChatMessageDTO(
                savedMessage.getChatRoomId(),
                savedMessage.getSenderId(),
                savedMessage.getContent(),
                savedMessage.getTimestamp(),
                senderUnreadCount,
                receiverUnreadCount
        );

        messagingTemplate.convertAndSend("/topic/chatRooms", responseMessage);
        logger.info("sendMessage - 메시지 전송 완료 - ChatRoomId: {}, SenderId: {}, ReceiverId: {}",
                messageDTO.getChatRoomId(), messageDTO.getSenderId(), receiverId);

        return ResponseEntity.ok(responseMessage);
    }

    @GetMapping("/myChatRooms/{userId}")
    public ResponseEntity<List<ChatRoomDTO>> getChatRoomsForUser(@PathVariable String userId) {
        List<ChatRoomDTO> chatRooms = chatService.getChatRoomsForUser(userId);
        logger.info("getChatRoomsForUser - UserId: {}, 방 개수: {}", userId, chatRooms.size());
        return ResponseEntity.ok(chatRooms);
    }

    @PostMapping("/markMessagesAsRead/{chatRoomId}/{userId}")
    public ResponseEntity<String> markMessagesAsRead(
            @PathVariable String chatRoomId,
            @PathVariable String userId) {
        int markedCount = chatService.markMessagesAsRead(chatRoomId, userId);
        logger.info("markMessagesAsRead - 채팅방 ID: {}, UserId: {}, 읽음 처리된 메시지 수: {}", chatRoomId, userId, markedCount);
        return ResponseEntity.ok("Marked " + markedCount + " messages as read.");
    }

    @PostMapping("/enterRoom/{chatRoomId}/{userId}")
    public ResponseEntity<Void> enterRoom(
            @PathVariable String chatRoomId,
            @PathVariable String userId) {
        logger.info("enterRoom - 사용자가 채팅방에 입장 - chatRoomId: {}, userId: {}", chatRoomId, userId);
        chatService.enterRoom(chatRoomId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/leaveRoom/{chatRoomId}/{userId}")
    public ResponseEntity<Void> leaveRoom(
            @PathVariable String chatRoomId,
            @PathVariable String userId) {
        chatService.leaveRoom(chatRoomId, userId);
        logger.info("leaveRoom - 사용자가 채팅방에서 나감 - chatRoomId: {}, userId: {}", chatRoomId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/isUserInRoom/{chatRoomId}/{userId}")
    public ResponseEntity<Boolean> isUserInRoom(
            @PathVariable String chatRoomId,
            @PathVariable String userId) {
        boolean isUserInRoom = chatService.isUserInRoom(chatRoomId, userId);
        logger.info("isUserInRoom - 채팅방 ID: {}, UserId: {}, 입장 여부: {}", chatRoomId, userId, isUserInRoom);
        return ResponseEntity.ok(isUserInRoom);
    }
}
