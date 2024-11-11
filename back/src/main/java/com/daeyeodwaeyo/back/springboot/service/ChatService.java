package com.daeyeodwaeyo.back.springboot.service;

import com.daeyeodwaeyo.back.springboot.domain.ChatRoom;
import com.daeyeodwaeyo.back.springboot.listener.WebSocketEventListener;
import com.daeyeodwaeyo.back.springboot.domain.ChatMessage;
import com.daeyeodwaeyo.back.springboot.dto.ChatMessageDTO;
import com.daeyeodwaeyo.back.springboot.dto.ChatRoomDTO;
import com.daeyeodwaeyo.back.springboot.repository.ChatMessageRepository;
import com.daeyeodwaeyo.back.springboot.repository.ChatRoomRepository;
import com.daeyeodwaeyo.back.springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    @Autowired
    private WebSocketEventListener webSocketEventListener;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    // 방 찾기 또는 생성
    public ChatRoom findOrCreateRoom(String creatorId, String joinerId) {
        logger.info("findOrCreateRoom 호출 - creatorId: {}, joinerId: {}", creatorId, joinerId);

        Optional<ChatRoom> existingRoom = chatRoomRepository.findByCreatorIdAndJoinerId(creatorId, joinerId);
        if (existingRoom.isPresent()) {
            logger.info("기존 채팅방 존재 - chatRoomId: {}", existingRoom.get().getId());
            return existingRoom.get();
        } else {
            ChatRoom newRoom = new ChatRoom();
            newRoom.setCreatorId(creatorId);
            newRoom.setJoinerId(joinerId);
            ChatRoom savedRoom = chatRoomRepository.save(newRoom);
            logger.info("새 채팅방 생성 - chatRoomId: {}", savedRoom.getId());
            return savedRoom;
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
}
