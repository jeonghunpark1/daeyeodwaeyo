package com.daeyeodwaeyo.back.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.daeyeodwaeyo.back.springboot.domain.Review;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {
    // 추가적인 쿼리가 필요하다면 여기에 작성
    boolean existsByProductIdAndUserId(String productId, String userId);
    List<Review> findAllByProductId(String productId);

}
