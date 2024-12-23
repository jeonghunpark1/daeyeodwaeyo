package com.daeyeodwaeyo.back.springboot.controller;

import com.daeyeodwaeyo.back.springboot.config.JwtUtil;
import com.daeyeodwaeyo.back.springboot.domain.Application;
import com.daeyeodwaeyo.back.springboot.domain.User;
import com.daeyeodwaeyo.back.springboot.dto.ApplicationDTO;
import com.daeyeodwaeyo.back.springboot.dto.ChatRoomResponseDTO;
import com.daeyeodwaeyo.back.springboot.dto.ChatMessageDTO;
import com.daeyeodwaeyo.back.springboot.dto.ChatRoomDTO;
import com.daeyeodwaeyo.back.springboot.domain.ChatRoom;
import com.daeyeodwaeyo.back.springboot.domain.ChatMessage;
import com.daeyeodwaeyo.back.springboot.repository.UserRepository;
import com.daeyeodwaeyo.back.springboot.service.ChatService;
import com.daeyeodwaeyo.back.springboot.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    @Autowired
    private TransactionService transactionService;

    @PostMapping("/findOrCreateRoom")
    public ResponseEntity<ChatRoomResponseDTO> findOrCreateRoom(@RequestBody Map<String, String> request,
                                                                @RequestHeader("Authorization") String token) {
        String userId = jwtUtil.extractUsername(token.substring(7)); // "Bearer " 제거
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("아이디가 존재하지 않습니다."));
        String creatorId = user.getId();
        String joinerId = request.get("joinerId");
        String productId = request.get("productId");

        ChatRoom chatRoom = chatService.findOrCreateRoom(creatorId, joinerId, productId);
        logger.info("findOrCreateRoom - 생성된 채팅방 ID: {}", chatRoom.getId());
        return ResponseEntity.ok(new ChatRoomResponseDTO(chatRoom.getId()));
    }

    @GetMapping("/{chatRoomId}/productId")
    public ResponseEntity<Map<String, String>> getProductId(@PathVariable String chatRoomId) {
        try {
            String productId = chatService.getProductIdByChatRoomId(chatRoomId);
            Map<String, String> response = new HashMap<>();
            response.put("productId", productId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", e.getMessage()));
        }
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
        chatRooms.forEach(chatRoom -> logger.info("ChatRoomDTO 내용: {}", chatRoom));
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


    @GetMapping("/{roomId}/details")
    public ResponseEntity<ChatRoomDTO> getChatRoomDetails(
            @PathVariable String roomId,
            @RequestParam String userId
    ) {
        ChatRoomDTO chatRoomDetails = chatService.getChatRoomDetails(roomId, userId);
        logger.info("isUserInRoom - 채팅방 ID: {}, UserId: {}",  roomId, userId);

        return ResponseEntity.ok(chatRoomDetails);
    }


    @GetMapping("/{chatRoomId}")
    public ResponseEntity<Map<String, String>> getChatRoomParticipants(@PathVariable String chatRoomId) {
        ChatRoom chatRoom = chatService.findChatRoomById(chatRoomId);
        if (chatRoom != null) {
            logger.info("getChatRoomParticipants - 채팅방 ID: {}, CreatorId: {}, JoinerId: {}",
                    chatRoomId, chatRoom.getCreatorId(), chatRoom.getJoinerId());

            Map<String, String> response = Map.of(
                    "creatorId", chatRoom.getCreatorId(),
                    "joinerId", chatRoom.getJoinerId()
            );
            return ResponseEntity.ok(response);
        } else {
            logger.warn("getChatRoomParticipants - 채팅방 ID: {}를 찾을 수 없습니다.", chatRoomId);
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/application/status/{roomId}")
    public ResponseEntity<String> getApplicationStatusByRoomId(@PathVariable String roomId) {
        try {
            // 해당 채팅방 ID에 대한 신청서를 조회하고 상태 반환
            Application application = chatService.getApplicationByRoomId(roomId);
            return ResponseEntity.ok(application.getStatus());
        } catch (IllegalArgumentException e) {
            logger.error("해당 채팅방의 신청서를 찾을 수 없습니다 - RoomId: {}", roomId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            logger.error("신청서 상태 조회 중 오류 발생 - RoomId: {}", roomId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("신청서 상태 조회 중 오류가 발생했습니다.");
        }
    }
    @GetMapping("/{chatRoomId}/participants")
    public ResponseEntity<Map<String, String>> getChatRoomParticipantNames(@PathVariable String chatRoomId) {
        ChatRoom chatRoom = chatService.getChatRoomById(chatRoomId);
        if (chatRoom == null) {
            return ResponseEntity.notFound().build();
        }

        User creator = userRepository.findById(chatRoom.getCreatorId())
                .orElseThrow(() -> new UsernameNotFoundException("Creator not found"));
        User joiner = userRepository.findById(chatRoom.getJoinerId())
                .orElseThrow(() -> new UsernameNotFoundException("Joiner not found"));

        Map<String, String> participantNames = Map.of(
                "creatorName", creator.getName(),
                "joinerName", joiner.getName()
        );

        return ResponseEntity.ok(participantNames);
    }

    @PostMapping("/application/create")
    public ResponseEntity<Application> createApplication(@RequestBody ApplicationDTO applicationDTO, @RequestHeader("Authorization") String token) {
        logger.info("createApplication 호출됨 - DTO 데이터: {}", applicationDTO);
        logger.info("Authorization 헤더: {}", token);

        Application createdApplication = chatService.createApplication(applicationDTO);
        logger.info("신청서 저장 성공 - ApplicationId: {}, ChatRoomId: {}",
                createdApplication.getApplicationId(), createdApplication.getChatRoom().getId());
        return ResponseEntity.ok(createdApplication);
    }

    @GetMapping("/exists/{chatRoomId}")
    public ResponseEntity<Boolean> checkApplicationExists(@PathVariable String chatRoomId) {
        boolean exists = chatService.checkApplicationExists(chatRoomId);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/application/{chatRoomId}")
    public ResponseEntity<List<Application>> getApplicationsByChatRoom(@PathVariable String chatRoomId) {
        List<Application> applications = chatService.getApplicationsByChatRoomId(chatRoomId);
        return ResponseEntity.ok(applications);
    }
    @GetMapping("/applications/user/{userId}")
    public ResponseEntity<List<Application>> getApplicationsByUserId(@PathVariable String userId) {
        // TransactionService 인스턴스를 통해 사용자 ID로 신청서를 조회
        List<Application> applications = transactionService.getApplicationsByUserId(userId);
        return ResponseEntity.ok(applications);
    }
    @GetMapping("/applications/user/{userId}/withProductTitle")
    public ResponseEntity<List<Map<String, String>>> getApplicationsWithProductTitle(@PathVariable String userId) {
        try {
            List<Map<String, String>> result = transactionService.getApplicationsWithProductTitle(userId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("Error fetching applications with product titles for userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList(Map.of("error", "데이터를 가져오는 중 오류가 발생했습니다.")));
        }
    }


    @PatchMapping("/application/updateStatusByRoomId/{roomId}")
    public ResponseEntity<Application> updateApplicationStatusByRoomId(
            @PathVariable String roomId,
            @RequestParam String status) {
        try {
            Application updatedApplication = chatService.updateApplicationStatusByRoomId(roomId, status);
            return ResponseEntity.ok(updatedApplication);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @DeleteMapping("/delete/{roomId}")
    public ResponseEntity<String> deleteApplication(@PathVariable String roomId) {
        try {
            chatService.deleteApplication(roomId);
            return ResponseEntity.ok("신청서 삭제 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("신청서 삭제 중 오류 발생");
        }
    }





}
