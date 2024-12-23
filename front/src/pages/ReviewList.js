import React from 'react';
import style from "../styles/reviewList.module.css";

export default function ReviewList({ reviews }) {
    if (!reviews || reviews.length === 0) {
        return <p className={style.noReviews}>리뷰가 없습니다.</p>;
    }

    return (
        <div className={style.reviewList}>

            {reviews.map((review) => (
                <div key={review.reviewId} className={style.reviewItem}>
                    <div className={style.reviewHeader}>
                        <span className={style.reviewer}>작성자: {review.userId}</span>
                        <span className={style.rating}>⭐ {review.rating}</span>
                    </div>
                    <div className={style.reviewBody}>
                        <p>{review.reviewText}</p>
                    </div>
                    <div className={style.reviewFooter}>
                        <span className={style.createdAt}>작성일: {new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
