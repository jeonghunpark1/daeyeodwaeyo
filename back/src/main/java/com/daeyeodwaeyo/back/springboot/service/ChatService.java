package com.daeyeodwaeyo.back.springboot.service;

import com.daeyeodwaeyo.back.springboot.domain.Application;
import com.daeyeodwaeyo.back.springboot.domain.ChatRoom;
import com.daeyeodwaeyo.back.springboot.dto.ApplicationDTO;
import com.daeyeodwaeyo.back.springboot.listener.WebSocketEventListener;
import com.daeyeodwaeyo.back.springboot.domain.ChatMessage;
import com.daeyeodwaeyo.back.springboot.dto.ChatMessageDTO;
import com.daeyeodwaeyo.back.springboot.dto.ChatRoomDTO;
import com.daeyeodwaeyo.back.springboot.repository.ChatMessageRepository;
import com.daeyeodwaeyo.back.springboot.repository.ChatRoomRepository;
import com.daeyeodwaeyo.back.springboot.repository.UserRepository;
import com.daeyeodwaeyo.back.springboot.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private WebSocketEventListener webSocketEventListener;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    // 방 찾기 또는 생성
    public ChatRoom findOrCreateRoom(String creatorId, String joinerId, String productId) {
        logger.info("findOrCreateRoom 호출 - creatorId: {}, joinerId: {}, productId: {}", creatorId, joinerId, productId);

        // creatorId, joinerId, productId가 모두 일치하는 채팅방을 찾기 위해 조회
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByCreatorIdAndJoinerIdAndProductId(creatorId, joinerId, productId);
        if (existingRoom.isPresent()) {
            logger.info("기존 채팅방 존재 - chatRoomId: {}", existingRoom.get().getId());
            return existingRoom.get();
        } else {
            ChatRoom newRoom = new ChatRoom();
            newRoom.setCreatorId(creatorId);
            newRoom.setJoinerId(joinerId);
            newRoom.setProductId(productId); // productId 설정

            ChatRoom savedRoom = chatRoomRepository.save(newRoom);
            logger.info("새 채팅방 생성 - chatRoomId: {}", savedRoom.getId());
            return savedRoom;
        }
    }

    public Application getApplicationByRoomId(String roomId) {
        List<Application> applications = applicationRepository.findByChatRoomId(roomId);
        if (applications.isEmpty()) {
            throw new IllegalArgumentException("해당 채팅방에 신청서를 찾을 수 없습니다: " + roomId);
        }
        return applications.get(0); // 해당 채팅방에는 하나의 신청서만 존재한다고 가정
    }

    public String getProductIdByChatRoomId(String chatRoomId) {
        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(chatRoomId);
        if (chatRoomOptional.isPresent()) {
            return chatRoomOptional.get().getProductId();
        } else {
            throw new IllegalArgumentException("Chat room not found");
        }
    }

    public void enterRoom(String chatRoomId, String userId) {
        logger.info("ChatService - 사용자가 채팅방에 입장 - chatRoomId: {}, userId: {}", chatRoomId, userId);
        webSocketEventListener.addUserToRoom(chatRoomId, userId);
    }

    public void leaveRoom(String chatRoomId, String userId) {
        logger.info("사용자가 채팅방에서 나가기를 요청 - chatRoomId: {}, userId: {}", chatRoomId, userId);
        webSocketEventListener.removeUserFromRoom(chatRoomId, userId);
    }

    public boolean isUserInRoom(String chatRoomId, String userId) {
        return webSocketEventListener.isUserInRoom(chatRoomId, userId);
    }

    // 메시지 저장 및 송/수신자의 unreadCount 계산 및 전송
    public ChatMessage saveMessage(ChatMessageDTO messageDTO) {
        logger.info("saveMessage 호출 - messageDTO: {}", messageDTO);

        ChatMessage message = new ChatMessage();
        message.setChatRoomId(messageDTO.getChatRoomId());
        message.setSenderId(messageDTO.getSenderId());
        message.setContent(messageDTO.getContent());
        message.setTimestamp(LocalDateTime.now());

        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findById(messageDTO.getChatRoomId());
        if (chatRoomOpt.isPresent()) {
            ChatRoom chatRoom = chatRoomOpt.get();
            String recipientId = chatRoom.getCreatorId().equals(messageDTO.getSenderId())
                    ? chatRoom.getJoinerId()
                    : chatRoom.getCreatorId();

            boolean isRecipientInRoom = webSocketEventListener.isUserInRoom(messageDTO.getChatRoomId(), recipientId);
            message.setIsRead(isRecipientInRoom);

            ChatMessage savedMessage = chatMessageRepository.save(message);
            logger.info("메시지 저장 완료 - messageId: {}", savedMessage.getId());

            // 송신자와 수신자 각각의 unreadCount 계산
            long senderUnreadCount = calculateUnreadMessages(messageDTO.getChatRoomId(), messageDTO.getSenderId());
            long recipientUnreadCount = calculateUnreadMessages(messageDTO.getChatRoomId(), recipientId);

            logger.info("SenderUnreadCount: {}, RecipientUnreadCount: {}", senderUnreadCount, recipientUnreadCount);

            // 송신자용 메시지 생성 및 전송
            ChatMessageDTO senderMessageDTO = new ChatMessageDTO(
                    savedMessage.getChatRoomId(),
                    savedMessage.getSenderId(),
                    savedMessage.getContent(),
                    savedMessage.getTimestamp(),
                    senderUnreadCount,
                    recipientUnreadCount
            );
            webSocketEventListener.broadcastToUser(messageDTO.getSenderId(), senderMessageDTO);
            logger.info("송신자에게 전송 완료 - SenderId: {}, ChatRoomId: {}", messageDTO.getSenderId(), messageDTO.getChatRoomId());

            // 수신자용 메시지 생성 및 전송
            ChatMessageDTO recipientMessageDTO = new ChatMessageDTO(
                    savedMessage.getChatRoomId(),
                    savedMessage.getSenderId(),
                    savedMessage.getContent(),
                    savedMessage.getTimestamp(),
                    recipientUnreadCount,
                    senderUnreadCount
            );
            logger.info("수신자에게 전송 준비 - ChatRoomId: {}, RecipientId: {}, recipientUnreadCount: {}, senderUnreadCount: {}",
                    recipientMessageDTO.getChatRoomId(), recipientId, recipientUnreadCount, senderUnreadCount);
            webSocketEventListener.broadcastToUser(recipientId, recipientMessageDTO);
            logger.info("수신자에게 전송 완료 - RecipientId: {}, ChatRoomId: {}", recipientId, messageDTO.getChatRoomId());

            return savedMessage;
        } else {
            logger.warn("채팅방을 찾을 수 없습니다 - chatRoomId: {}", messageDTO.getChatRoomId());
            return null;
        }
    }

    // 채팅방의 메시지 목록 가져오기
    public List<ChatMessageDTO> getMessages(String chatRoomId) {
        logger.info("getMessages 호출 - chatRoomId: {}", chatRoomId);
        List<ChatMessage> messages = chatMessageRepository.findByChatRoomIdOrderByTimestampAsc(chatRoomId);
        logger.info("조회된 메시지 수 - chatRoomId: {}, count: {}", chatRoomId, messages.size());
        return messages.stream().map(message -> new ChatMessageDTO(
                message.getChatRoomId(),
                message.getSenderId(),
                message.getContent(),
                message.getTimestamp()
        )).collect(Collectors.toList());
    }

    public String getRecipientId(String chatRoomId, String senderId) {
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findById(chatRoomId);
        if (chatRoomOpt.isPresent()) {
            ChatRoom chatRoom = chatRoomOpt.get();
            return chatRoom.getCreatorId().equals(senderId) ? chatRoom.getJoinerId() : chatRoom.getCreatorId();
        } else {
            throw new IllegalArgumentException("채팅방을 찾을 수 없습니다: " + chatRoomId);
        }
    }

    public List<ChatRoomDTO> getChatRoomsForUser(String userId) {
        logger.info("getChatRoomsForUser 호출 - userId: {}", userId);
        List<ChatRoom> chatRooms = chatRoomRepository.findByCreatorIdOrJoinerId(userId);
        return chatRooms.stream().map(chatRoom -> {
            Optional<ChatMessage> lastMessage = chatMessageRepository.findTopByChatRoomIdOrderByTimestampDesc(chatRoom.getId());
            String opponentId = chatRoom.getCreatorId().equals(userId) ? chatRoom.getJoinerId() : chatRoom.getCreatorId();
            Optional<String> opponentNickname = userRepository.findNicknameById(opponentId);
            Optional<String> opponentProfileImage = userRepository.findProfileImageById(opponentId);

            long unreadCount = chatMessageRepository.countByChatRoomIdAndIsReadFalseAndSenderIdNot(chatRoom.getId(), userId);

            ChatRoomDTO chatRoomDTO = new ChatRoomDTO();
            chatRoomDTO.setChatRoomId(chatRoom.getId());
            chatRoomDTO.setCreatorId(chatRoom.getCreatorId());
            chatRoomDTO.setJoinerId(chatRoom.getJoinerId());
            chatRoomDTO.setLastMessage(lastMessage.map(ChatMessage::getContent).orElse(""));
            chatRoomDTO.setLastMessageTimestamp(lastMessage.map(ChatMessage::getTimestamp).orElse(null));
            chatRoomDTO.setJoinerNickname(opponentNickname.orElse("Unknown"));
            chatRoomDTO.setJoinerProfileImage(opponentProfileImage.orElse(null));
            chatRoomDTO.setUnreadCount(unreadCount);

            logger.info("ChatRoomDTO 생성 완료 - ChatRoomId: {}, UnreadCount: {}", chatRoomDTO.getChatRoomId(), unreadCount);
            return chatRoomDTO;
        }).collect(Collectors.toList());
    }

    public long calculateUnreadMessages(String chatRoomId, String userId) {
        long unreadCount = chatMessageRepository.countByChatRoomIdAndIsReadFalseAndSenderIdNot(chatRoomId, userId);
        logger.info("Unread 메시지 수 계산 - ChatRoomId: {}, UserId: {}, UnreadCount: {}", chatRoomId, userId, unreadCount);
        return unreadCount;
    }

    public int markMessagesAsRead(String chatRoomId, String userId) {
        List<ChatMessage> unreadMessages = chatMessageRepository.findByChatRoomIdAndIsReadFalseAndSenderIdNot(chatRoomId, userId);
        unreadMessages.forEach(message -> message.setIsRead(true));
        chatMessageRepository.saveAll(unreadMessages);
        logger.info("읽음 처리된 메시지 수 - chatRoomId: {}, UserId: {}, count: {}", chatRoomId, userId, unreadMessages.size());
        return unreadMessages.size();
    }

    public ChatRoom findChatRoomById(String chatRoomId) {
        return chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found for id: " + chatRoomId));
    }
    public ChatRoom getChatRoomById(String chatRoomId) {
        return chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("ChatRoom not found with ID: " + chatRoomId));
    }

    public Application createApplication(ApplicationDTO applicationDTO) {
        logger.info("createApplication 호출 - DTO 데이터: {}", applicationDTO);

        // DTO 데이터 검증
        if (applicationDTO.getChatRoomId() == null || applicationDTO.getApplicantId() == null || applicationDTO.getLenderId() == null) {
            logger.error("필수 데이터 누락 - DTO 데이터: {}", applicationDTO);
            throw new IllegalArgumentException("필수 데이터가 누락되었습니다.");
        }

        Application application = new Application();
        application.setApplicationId(UUID.randomUUID().toString());
        application.setChatRoom(chatRoomRepository.findById(applicationDTO.getChatRoomId())
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다: " + applicationDTO.getChatRoomId())));
        application.setStartDate(applicationDTO.getStartDate());
        application.setEndDate(applicationDTO.getEndDate());
        application.setPrice(applicationDTO.getPrice());
        application.setLocation(applicationDTO.getLocation());
        application.setApplicant(userRepository.findById(applicationDTO.getApplicantId())
                .orElseThrow(() -> new IllegalArgumentException("신청자를 찾을 수 없습니다: " + applicationDTO.getApplicantId())));
        application.setLender(userRepository.findById(applicationDTO.getLenderId())
                .orElseThrow(() -> new IllegalArgumentException("대여자를 찾을 수 없습니다: " + applicationDTO.getLenderId())));
        application.setStatus(applicationDTO.getStatus() != null ? applicationDTO.getStatus() : "PENDING");

        Application savedApplication = applicationRepository.save(application);
        logger.info("신청서 저장 완료 - ApplicationId: {}", savedApplication.getApplicationId());

        return savedApplication;
    }


    public ChatRoomDTO getChatRoomDetails(String roomId, String userId) {
        // 채팅방 정보 조회
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("해당 채팅방이 존재하지 않습니다."));

        // 상대방 ID 결정
        String opponentId = chatRoom.getCreatorId().equals(userId)
                ? chatRoom.getJoinerId()
                : chatRoom.getCreatorId();

        // 상대방 정보 조회
        String opponentNickname = userRepository.findNicknameById(opponentId)
                .orElse("Unknown");
        String opponentProfileImage = userRepository.findProfileImageById(opponentId)
                .orElse(null);

        // DTO 생성 및 반환
        return new ChatRoomDTO(
                chatRoom.getId(),
                chatRoom.getCreatorId(),
                chatRoom.getJoinerId(),
                null, // 마지막 메시지
                null, // 마지막 메시지 시간
                opponentNickname,
                opponentProfileImage,
                0 // 안 읽은 메시지 개수
        );
    }

    public List<Application> getApplicationsByChatRoomId(String chatRoomId) {
        logger.info("getApplicationsByChatRoomId 호출 - ChatRoomId: {}", chatRoomId);

        if (!chatRoomRepository.existsById(chatRoomId)) {
            logger.error("채팅방 ID '{}'가 존재하지 않습니다.", chatRoomId);
            throw new IllegalArgumentException("채팅방 ID가 유효하지 않습니다: " + chatRoomId);
        }

        List<Application> applications = applicationRepository.findByChatRoomId(chatRoomId);
        logger.info("조회된 신청서 수: {}", applications.size());
        return applications;
    }
    public boolean checkApplicationExists(String chatRoomId) {
        logger.info("checkApplicationExists 호출 - chatRoomId: {}", chatRoomId);

        // chatRoomId를 사용해 ChatRoom 객체를 가져옵니다.
        Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findById(chatRoomId);
        if (chatRoomOptional.isPresent()) {
            ChatRoom chatRoom = chatRoomOptional.get();
            return applicationRepository.existsByChatRoom(chatRoom);
        } else {
            return false; // 채팅방이 없으면 신청서도 당연히 없다고 판단
        }
    }


    // 신청서 상태 업데이트
    // RoomId로 신청서 상태 업데이트
    // ChatService.java
    // 신청서 상태 업데이트
// RoomId로 신청서 상태 업데이트
// ChatService.java
    public Application updateApplicationStatusByRoomId(String roomId, String status) {
        logger.info("updateApplicationStatusByRoomId 호출 - RoomId: {}, New Status: {}", roomId, status);

        List<Application> applications = applicationRepository.findByChatRoomId(roomId);
        if (applications.isEmpty()) {
            throw new IllegalArgumentException("해당 채팅방에 신청서를 찾을 수 없습니다: " + roomId);
        }

        Application application = applications.get(0);

        // 상태 업데이트가 가능한 경우 확인
        if ("APPROVED".equalsIgnoreCase(application.getStatus()) && "RETURNED".equalsIgnoreCase(status)) {
            // 이미 APPROVED 상태일 경우 RETURNED로 업데이트 가능하도록 수정
            validateStatus(status);
            String previousStatus = application.getStatus();
            application.setStatus(status.toUpperCase());

            Application updatedApplication = applicationRepository.save(application);
            logger.info("신청서 상태 업데이트 완료 - RoomId: {}, Previous Status: {}, New Status: {}", roomId, previousStatus, status);
            return updatedApplication;
        } else if ("PENDING".equalsIgnoreCase(application.getStatus())) {
            // PENDING 상태는 APPROVED로 변경할 수 있도록 허용
            validateStatus(status);
            String previousStatus = application.getStatus();
            application.setStatus(status.toUpperCase());

            Application updatedApplication = applicationRepository.save(application);
            logger.info("신청서 상태 업데이트 완료 - RoomId: {}, Previous Status: {}, New Status: {}", roomId, previousStatus, status);
            return updatedApplication;
        } else {
            throw new IllegalStateException("현재 상태에서 요청된 상태로 변경할 수 없습니다.");
        }
    }


    public void deleteApplication(String roomId) {
        logger.info("deleteApplication 호출 - RoomId: {}", roomId);

        // 신청서 조회 후 삭제
        List<Application> applications = applicationRepository.findByChatRoomId(roomId);
        if (!applications.isEmpty()) {
            for (Application application : applications) {
                applicationRepository.delete(application);
                logger.info("신청서 삭제 완료 - ApplicationId: {}", application.getApplicationId());
            }
        } else {
            logger.error("해당 신청서를 찾을 수 없습니다 - RoomId: {}", roomId);
            throw new IllegalArgumentException("Application not found with RoomId: " + roomId);
        }
    }

    // 상태 검증 메서드
    // 상태 검증 메서드
    private void validateStatus(String status) {
        List<String> allowedStatuses = List.of("PENDING", "APPROVED", "DENIED", "RETURNED"); // "RETURNED" 추가
        if (!allowedStatuses.contains(status.toUpperCase())) {
            logger.error("유효하지 않은 상태 값: {}", status);
            throw new IllegalArgumentException("유효하지 않은 상태 값입니다: " + status);
        }
    }


    // 신청서 조회 메서드
    private Application getApplicationById(String applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> {
                    logger.error("Application ID '{}'를 찾을 수 없습니다.", applicationId);
                    return new IllegalArgumentException("Application not found with ID: " + applicationId);
                });
    }

    // 특정 채팅방과 신청자에 해당하는 신청서 찾기
    private Application findApplicationByChatRoomAndApplicant(String chatRoomId, String applicantId) {
        List<Application> applications = applicationRepository.findByChatRoomId(chatRoomId);
        return applications.stream()
                .filter(app -> app.getApplicant().getId().equals(applicantId))
                .findFirst()
                .orElseThrow(() -> {
                    logger.error("해당 신청서를 찾을 수 없습니다 - ChatRoomId: {}, ApplicantId: {}", chatRoomId, applicantId);
                    return new IllegalArgumentException("Application not found with RoomId: " + chatRoomId + " and ApplicantId: " + applicantId);
                });
    }
//1단계 서비스 챗룸아이디 찾기


}
