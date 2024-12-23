import React, { useState, useEffect } from 'react';
import ReviewModal from './ReviewModal';
import style from "../../styles/transactionItem.module.css";
import axios from "axios";

import { API_BASE_URL } from '../../utils/constants';

export default function TransactionItem({
                                            productName,
                                            productId,
                                            userId,
                                            joinerId,
                                            startDate,
                                            endDate,
                                            applicant,
                                            lender,
                                            status,
                                            location,
                                            price,
                                        }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReviewExist, setIsReviewExist] = useState(false);

    // 리뷰 존재 여부 확인
    const fetchReviewExistence = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/reviews/check`, {
                params: { productId, userId },
            });
            console.log("리뷰 존재 여부:", response.data);
            setIsReviewExist(response.data); // 서버에서 받은 값 설정
        } catch (error) {
            console.error("리뷰 확인 요청 실패:", error);
        }
    };

    useEffect(() => {
        fetchReviewExistence();
    }, [productId, userId]);

    const handleWriteReview = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = async () => {
        setIsModalOpen(false);
        await fetchReviewExistence(); // 모달 닫힌 후 리뷰 상태 다시 확인
    };

    const handleReviewSubmit = async (review) => {
        console.log(`${productName}에 대한 리뷰 제출됨:`, review);
        try {
            await axios.post(`${API_BASE_URL}/api/reviews`, {
                productId,
                userId,
                reviewText: review.text,
                rating: review.rating,
            });
            alert("리뷰가 성공적으로 제출되었습니다!");
            await fetchReviewExistence(); // 리뷰 작성 후 상태 갱신
            setIsModalOpen(false);
        } catch (error) {
            console.error("리뷰 작성 실패:", error);
            alert("리뷰 작성 중 문제가 발생했습니다.");
        }
    };

    return (
        <div className={style.transactionItem}>
            <div className={style.transactionTitleWrap}>
                {status === "RETURNED" && userId !== joinerId && (
                    isReviewExist ? (
                        <span className={style.finishButton}>작성 완료</span>
                    ) : (
                        <button className={style.reviewButton} onClick={handleWriteReview}>
                            리뷰 작성
                        </button>
                    )
                )}
                <div className={style.transactionTitle}>
                    <strong>{productName}</strong>
                </div>
            </div>
            <div className={style.transactionDetails}>
                <div className={style.transactionField}><strong>상태:</strong> {status}</div>
                <div className={style.transactionField}><strong>장소:</strong> {location}</div>
                <div className={style.transactionField}><strong>시작 날짜:</strong> {startDate}</div>
                <div className={style.transactionField}><strong>종료 날짜:</strong> {endDate}</div>
                <div className={style.transactionField}><strong>신청인:</strong> {applicant}</div>
                <div className={style.transactionField}><strong>대여자:</strong> {lender}</div>
                <div className={style.transactionField}><strong>가격:</strong> {price}원</div>
            </div>
            {/* 리뷰 작성 모달 */}
            <ReviewModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleReviewSubmit}
                productName={productName}
                productId={productId}
                userId={userId}
            />
        </div>
    );
}
