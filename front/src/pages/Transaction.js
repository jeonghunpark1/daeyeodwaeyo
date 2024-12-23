import React, { useEffect, useState } from 'react';
import style from "../styles/transactionHistory.module.css";
import TransactionItem from './Transaction/TransactionItem';
import ReviewModal from './Transaction/ReviewModal'; // ReviewModal 추가
import axios from "axios";

import { API_BASE_URL } from '../utils/constants';

export default function TransactionHistory() {
    const [currentPage, setCurrentPage] = useState("all");
    const [userInfo, setUserInfo] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [transactions, setTransactions] = useState({
        all: [],
        pending: [],
        completed: [],
        returned: [],
    });

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // 모달 상태
    const [selectedTransaction, setSelectedTransaction] = useState(null); // 선택된 거래 데이터

    // 로그인 상태 확인 및 사용자 정보 가져오기
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedLoginStatus = localStorage.getItem("isLogin") === "true";

        if (token && storedLoginStatus) {
            console.log("로그인 상태 확인: 로그인됨");
            setIsLogin(true);
            fetchUserInfo(token);
        } else {
            console.log("로그인 상태 확인: 로그아웃 상태");
            setIsLogin(false);
        }
    }, []);

    // 사용자 정보가 업데이트되면 거래 데이터 요청
    useEffect(() => {
        if (userInfo) {
            console.log("사용자 정보 가져옴, 거래 내역 요청 시작");
            fetchTransactions();
        }
    }, [userInfo]);

    // 사용자 정보 가져오기
    const fetchUserInfo = (token) => {
        axios.get(`${API_BASE_URL}/api/users/headerUserInfo`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then((response) => {
                console.log("사용자 정보 가져오기 성공:", response.data);
                setUserInfo(response.data);
            })
            .catch((err) => {
                console.error('유저 정보 가져오기 실패:', err);
                setIsLogin(false);
                setUserInfo(null);
            });
    };

    // 거래 내역 가져오기
    const fetchTransactions = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("토큰이 없습니다. 거래 내역을 가져올 수 없습니다.");
            return;
        }

        if (!userInfo || !userInfo.id) {
            console.error("사용자 정보가 없습니다. 거래 내역을 가져올 수 없습니다.");
            return;
        }

        const productTitleRequest = axios.get(
            `${API_BASE_URL}/api/chat/applications/user/${userInfo.id}/withProductTitle`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const applicationRequest = axios.get(
            `${API_BASE_URL}/api/chat/applications/user/${userInfo.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        Promise.all([productTitleRequest, applicationRequest])
            .then(([productResponse, applicationResponse]) => {
                console.log("Product Titles 가져오기 성공:", productResponse.data);
                console.log("Applications 가져오기 성공:", applicationResponse.data);

                const productTitleMap = productResponse.data.reduce((map, item) => {
                    map[item.applicationId] = {
                        productName: item.productName || "상품 정보 없음",
                        productId: item.productId || null,
                    };
                    return map;
                }, {});

                const data = applicationResponse.data.map(application => {
                    const productInfo = productTitleMap[application.applicationId] || {};
                    const productId = productInfo.productId || application.chatRoom?.productId;

                    const joinerId = application.chatRoom?.joinerId || null; // joinerId 추출

                    console.log("fetchTransactions - joinerId:", joinerId);

                    return {
                        ...application,
                        productName: productInfo.productName,
                        productId,
                        joinerId, // joinerId 추가
                        applicant: application.applicant.name,
                        lender: application.lender.name,
                    };
                });

                console.log("최종 매핑된 Transaction 데이터:", data);

                setTransactions({
                    all: data,
                    pending: data.filter(t => t.status === "PENDING"),
                    completed: data.filter(t => t.status === "COMPLETED"),
                    returned: data.filter(t => t.status === "RETURNED"),
                });
            })
            .catch((err) => {
                console.error("거래 데이터 가져오기 실패:", err);
            });
    };


    // 리뷰 작성 버튼 클릭
    const handleWriteReview = (transaction) => {
        console.log("리뷰 작성 버튼 클릭 - transaction:", transaction);
        console.log("리뷰 작성 버튼 클릭 - transaction.productId:", transaction.productId);
        console.log("리뷰 작성 버튼 클릭 - userInfo.id:", userInfo.id);

        setSelectedTransaction(transaction);
        setIsReviewModalOpen(true);
    };

    // 현재 페이지의 거래 내역 렌더링
    const contentPage = (currentPage) => {
        const currentTransactions = transactions[currentPage] || [];
        return (
            <>
                <div className={style.transactionHistory_title_wrap}>
                    <h3 className={style.transactionHistory_title}>
                        {currentPage === "all" ? "전체 보기" :
                            currentPage === "pending" ? "신청대기" :
                                currentPage === "completed" ? "신청완료" :
                                    currentPage === "returned" ? "반납완료" : ""}
                    </h3>
                </div>
                <div className={style.transactionHistory_content}>
                    {currentTransactions.length > 0 ? (
                        currentTransactions.map((transaction, index) => (
                            <div key={index} className={style.transaction_item}>
                                <TransactionItem
                                    productName={transaction.productName}
                                    productId={transaction.productId} // 추가: productId 전달
                                    userId={userInfo.id} // 추가: userId 전달
                                    joinerId={transaction.joinerId} // joinerId 전달
                                    startDate={transaction.startDate}
                                    endDate={transaction.endDate}
                                    applicant={transaction.applicant}
                                    lender={transaction.lender}
                                    status={transaction.status}
                                    location={transaction.location}
                                    price={transaction.price}
                                    onReview={() => handleWriteReview(transaction)} // 리뷰 작성 클릭 핸들러 전달
                                />
                            </div>
                        ))
                    ) : (
                        <p className={style.placeholder}>거래 내역이 없습니다.</p>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className={style.transactionHistory_page}>
            <div className={style.transactionHistory_title_wrap}>
                <h2 className={style.transactionHistory_title}>거래 내역</h2>
            </div>
            <div className={style.transactionHistory_content_box}>
                <div className={style.transactionHistory_nav_wrap}>
                    <button
                        className={style.menu}
                        onClick={() => setCurrentPage("all")}>전체 보기</button>
                    <button
                        className={style.menu}
                        onClick={() => setCurrentPage("pending")}>신청대기</button>
                    <button
                        className={style.menu}
                        onClick={() => setCurrentPage("completed")}>신청완료</button>
                    <button
                        className={style.menu}
                        onClick={() => setCurrentPage("returned")}>반납완료</button>
                </div>
                <div className={style.transactionHistory_content_wrap}>
                    {contentPage(currentPage)}
                </div>
            </div>

            {/* Review Modal */}
            {isReviewModalOpen && selectedTransaction && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    productId={selectedTransaction.productId}
                    userId={userInfo.id}
                    productName={selectedTransaction.productName}
                />
            )}
        </div>
    );
}
