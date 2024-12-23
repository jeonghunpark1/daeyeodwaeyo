package com.daeyeodwaeyo.back.springboot.service;

import com.daeyeodwaeyo.back.springboot.domain.Application;
import com.daeyeodwaeyo.back.springboot.repository.ApplicationRepository;
import com.daeyeodwaeyo.back.springboot.repository.ProductRepository;
import org.springframework.stereotype.Service;
import com.daeyeodwaeyo.back.springboot.domain.Product;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {

    private final ApplicationRepository applicationRepository;
    private final ProductRepository productRepository;

    public TransactionService(ApplicationRepository applicationRepository, ProductRepository productRepository) {
        this.applicationRepository = applicationRepository;
        this.productRepository = productRepository;
    }

    /**
     * 사용자 ID를 기반으로 신청서 목록을 반환
     *
     * @param userId 사용자 ID
     * @return 신청서 목록
     */
    public List<Application> getApplicationsByUserId(String userId) {
        // 신청인 또는 대여자로 참여한 신청서 조회
        return applicationRepository.findByApplicantIdOrLenderId(userId, userId);
    }

    /**
     * 특정 채팅방 ID를 기반으로 신청서 목록을 반환
     *
     * @param chatRoomId 채팅방 ID
     * @return 신청서 목록
     */
    public List<Application> getApplicationsByChatRoomId(String chatRoomId) {
        return applicationRepository.findByChatRoomId(chatRoomId);
    }

    /**
     * 사용자 ID와 관련된 신청서 목록과 상품 정보를 반환
     *
     * @param userId 사용자 ID
     * @return 신청서와 상품 정보를 포함한 목록
     */
    public List<Map<String, String>> getApplicationsWithProductTitle(String userId) {
        // 신청인 또는 대여자로 참여한 신청서 조회
        List<Application> applications = applicationRepository.findByApplicantIdOrLenderId(userId, userId);

        // 신청서와 상품 타이틀 매핑
        return applications.stream().map(application -> {
            Map<String, String> applicationWithProduct = new HashMap<>();
            applicationWithProduct.put("applicationId", application.getApplicationId());
            applicationWithProduct.put("status", application.getStatus());
            applicationWithProduct.put("productName", productRepository.findById(application.getChatRoom().getProductId())
                    .map(Product::getTitle) // 상품의 타이틀 가져오기
                    .orElse("상품 정보 없음"));
            return applicationWithProduct;
        }).toList();
    }

}
