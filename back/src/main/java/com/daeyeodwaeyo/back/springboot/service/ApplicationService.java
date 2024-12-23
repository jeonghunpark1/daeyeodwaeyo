package com.daeyeodwaeyo.back.springboot.service;

import com.daeyeodwaeyo.back.springboot.controller.ApplicationController;
import com.daeyeodwaeyo.back.springboot.domain.Application;
import com.daeyeodwaeyo.back.springboot.domain.ChatRoom;
import com.daeyeodwaeyo.back.springboot.domain.Product;
import com.daeyeodwaeyo.back.springboot.repository.ApplicationRepository;
import com.daeyeodwaeyo.back.springboot.repository.ChatRoomRepository;
import com.daeyeodwaeyo.back.springboot.repository.ProductRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ProductRepository productRepository;
    private static final Logger logger = LoggerFactory.getLogger(ApplicationController.class);

    // 특정 applicant와 status가 RETURNED인 ChatRoomId 가져오기
    public List<String> getChatRoomIdsForReturnedApplications(String userId) {
        // applicant가 userId이고 status가 RETURNED인 Application 검색
        List<Application> applications = applicationRepository.findByApplicant_IdAndStatus(userId, "APPROVED");

        // Application에서 ChatRoomId만 추출
        return applications.stream()
                .map(application -> application.getChatRoom().getId()) // ChatRoom ID 추출
                .collect(Collectors.toList());
    }
    // ChatRoom ID 목록으로 Product ID 목록 가져오기
    public List<String> getProductIdsByChatRoomIds(List<String> chatRoomIds) {
        return chatRoomIds.stream()
                .map(chatRoomId -> {
                    return chatRoomRepository.findById(chatRoomId)
                            .map(ChatRoom::getProductId)
                            .orElseThrow(() -> new IllegalArgumentException("ChatRoom not found for ID: " + chatRoomId));
                })
                .collect(Collectors.toList());
    }
}
