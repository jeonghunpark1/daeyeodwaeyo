import React, { useState } from 'react';
import axios from 'axios';
import style from "../../styles/reviewModal.module.css";
import ReactStars from "react-rating-stars-component";

import { API_BASE_URL } from '../../utils/constants';

export default function ReviewModal({ isOpen, onClose, productId, userId, productName }) {
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const reviewText = e.target.review.value;

        if (rating === 0) {
            setError("별점을 선택해주세요.");
            setLoading(false);
            return;
        }

        if (!productId || !userId || !reviewText.trim()) {
            setError("필수 데이터가 누락되었습니다.");
            setLoading(false);
            return;
        }

        const reviewData = {
            productId,
            userId,
            reviewText,
            rating,
        };

        console.log("보내는 데이터:", reviewData);

        const token = localStorage.getItem('token');
        if (!token) {
            setError("로그인이 필요합니다.");
            setLoading(false);
            return;
        }

        console.log("사용하는 토큰:", token);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/reviews`, reviewData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log("리뷰 작성 성공:", response.data);
            alert("리뷰가 성공적으로 작성되었습니다!");
            setRating(0); // 별점 초기화
            e.target.review.value = ""; // 텍스트 초기화
            onClose(); // 모달 닫기
        } catch (error) {
            const serverMessage = error.response?.data?.message || "리뷰 작성 중 문제가 발생했습니다.";
            console.error("리뷰 작성 실패:", error);
            console.error("서버 응답:", error.response?.data || "응답 없음");
            setError(serverMessage);
        } finally {
            setLoading(false);
        }
    };


    const handleRatingChange = (newRating) => {
        console.log("별점 선택:", newRating);
        setRating(newRating);
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains(style.modalOverlay)) {
            onClose();
        }
    };

    return (
        <div className={style.modalOverlay} onClick={handleOverlayClick}>
            <div className={style.modalContent}>
                <h3>{productName} 리뷰 작성</h3>
                <form onSubmit={handleSubmit}>
                    <textarea
                        name="review"
                        placeholder="리뷰를 작성하세요..."
                        className={style.textArea}
                        required
                    ></textarea>
                    {error && <p className={style.errorText}>{error}</p>}
                    <div className={style.modalActions}>
                        <div className={style.ratingWrapper}>
                            <ReactStars
                                count={5}
                                value={rating}
                                onChange={handleRatingChange}
                                size={30}
                                activeColor="#ffd700"
                            />
                        </div>
                        <button type="submit" className={style.submitButton} disabled={loading}>
                            {loading ? "제출 중..." : "제출"}
                        </button>
                        <button type="button" onClick={onClose} className={style.cancelButton}>
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
