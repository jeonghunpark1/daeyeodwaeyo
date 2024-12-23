package com.daeyeodwaeyo.back.springboot.controller;

import com.daeyeodwaeyo.back.springboot.domain.Product;
import com.daeyeodwaeyo.back.springboot.service.ApplicationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationController.class);

    @Autowired
    private ApplicationService applicationService;

    // 기존: 특정 applicant와 status가 RETURNED인 ChatRoomId 가져오기
    @GetMapping("/returned-chatrooms")
    public ResponseEntity<List<String>> getChatRoomsForReturnedApplications(@RequestParam("userId") String userId) {
        logger.info("Received request to fetch returned chat rooms for userId: {}", userId);

        List<String> chatRoomIds = applicationService.getChatRoomIdsForReturnedApplications(userId);

        logger.info("Returning {} chat rooms for userId: {}", chatRoomIds.size(), userId);

        return ResponseEntity.ok(chatRoomIds);
    }

    // 새로 추가: 여러 ChatRoom ID로 Product ID를 가져오는 엔드포인트
    @PostMapping("/returned-products")
    public ResponseEntity<List<String>> getProductIdsByChatRoomIds(@RequestBody List<String> chatRoomIds) {
        logger.info("Received request to fetch product IDs for chat room IDs: {}", chatRoomIds);

        try {
            List<String> productIds = applicationService.getProductIdsByChatRoomIds(chatRoomIds);

            logger.info("Returning {} product IDs for chat room IDs", productIds.size());
            return ResponseEntity.ok(productIds);

        } catch (Exception e) {
            logger.error("Error occurred while fetching product IDs", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
