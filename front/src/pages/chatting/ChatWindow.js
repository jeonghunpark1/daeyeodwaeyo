import React, {useEffect, useRef, useState} from 'react';
import { useLocation,useParams} from 'react-router-dom';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import style from '../../styles/chatting/ChatWindow.module.css';

import { API_BASE_URL } from '../../utils/constants';

const ChatWindow = () => {
    const { roomId } = useParams();
    const [productDetail, setProductDetail] = useState(null);
    const [productId, setProductId] = useState(""); // productId 상태 추가
    const stompClientRef = useRef(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [senderId, setSenderId] = useState(null);
    const [creatorId, setCreatorId] = useState(null); //  생성자 ID
    const [joinerId, setJoinerId] = useState(null); // 채팅 참여자 ID
    const [profileImage, setProfileImage] = useState(null); // 기본 이미지 설정
    const [nickname, setNickname] = useState(null); // 기본 닉네임 설정
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [lentPeriod, setLentPeriod] = useState(0);
    const [lentPrice, setLentPrice] = useState(0);
    const location = useLocation();
    const [isEditable, setIsEditable] = useState(true);
    const [today, setToday] = useState(new Date());
    const [applicationStatus, setApplicationStatus] = useState(null);

    const [formData, setFormData] = useState({
        startDate: "", // 초기값을 빈 문자열로 설정
        endDate: "",
        price: "",
        location: "",
        applicant: "",
        lender: "",
    });
    const token = localStorage.getItem("token");

    const messagesEndRef = useRef(null);
// 오늘 날짜를 설정합니다.
    useEffect(() => {
        const now = new Date();
        setToday(now);
    }, []);
    useEffect(() => {
        const checkApplicationStatus = async () => {
            if (!token) {
                console.error("토큰이 없습니다. 요청을 보낼 수 없습니다.");
                return;
            }

            try {
                console.log("신청서 존재 여부 확인 요청:", roomId);
                const response = await axios.get(`${API_BASE_URL}/api/chat/exists/${roomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data) {
                    console.log("신청서가 이미 존재합니다. 수정 불가로 설정합니다.");

                    // 신청서 데이터 가져오기
                    const applicationResponse = await axios.get(`${API_BASE_URL}/api/chat/application/${roomId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (applicationResponse.data.length > 0) {
                        const applicationData = applicationResponse.data[0];
                        console.log("신청서 데이터:", applicationData);

                        // 상태 업데이트 (폼 데이터와 신청 상태)
                        setFormData({
                            startDate: applicationData.startDate,
                            endDate: applicationData.endDate,
                            price: applicationData.price,
                            location: applicationData.location,
                            applicant: applicationData.applicant.name,
                            lender: applicationData.lender.name,
                        });

                        setApplicationStatus(applicationData.status); // 상태 값 저장
                        setIsEditable(false);
                    }
                } else {
                    console.log("신청서가 존재하지 않습니다. 수정 가능합니다.");
                    setIsEditable(true);
                    setApplicationStatus(null); // 신청서가 없을 때 상태 초기화
                }
            } catch (error) {
                console.error("신청서 존재 여부 확인 중 오류 발생:", error);
            }
        };

        checkApplicationStatus();
    }, [roomId, token]);




    useEffect(() => {
        const handleMessage = (event) => {
            console.log("수신된 메시지:", event.data); // 추가된 로그
            if (event.origin !== window.location.origin) {
                console.warn("허용되지 않은 출처에서 온 메시지입니다.");
                return;
            }

            const { startDate, endDate } = event.data;

            if (startDate && endDate) {
                console.log("전달된 startDate:", startDate);
                console.log("전달된 endDate:", endDate);
                setStartDate(startDate);
                setEndDate(endDate);
                setIsSidebarOpen(true); // 빌리기를 통해서 들어갈 때 사이드바를 자동으로 엽니다.

            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);


    useEffect(() => {
        const token = localStorage.getItem("token");

        // 유효한 token과 roomId가 있는 경우에만 진행
        if (token && roomId) {
            fetchUserInfo(token); // senderId 초기화
        }
    }, [roomId]); // roomId가 변경되었을 때만 실행

    useEffect(() => {
        if (token && roomId && senderId) {
            fetchChatRoomDetails(token, roomId, senderId);
        }
    }, [senderId, roomId]);
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            startDate: startDate,
            endDate: endDate,
        }));
    }, [startDate, endDate]);
    useEffect(() => {
        if (productDetail) {
            if (lentPeriod === 0) {
                setLentPrice(productDetail.price);
            }
            setLentPrice(productDetail.price * lentPeriod);
        }
    }, [lentPeriod])

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUserInfo(token);
            fetchChatRoomParticipants();
            fetchChatRoomDetails(token); //  상세 정보 가져오기
            fetchChatRoomIds()
            fetchProductId(token, roomId);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && roomId) {
            console.log("fetchProductId 호출 - roomId:", roomId); // roomId 확인
            fetchProductId(token, roomId);
        }
    }, [roomId]);

    const fetchProductId = (token, roomId) => {
        console.log("fetchProductId 시작 - roomId:", roomId); // 로그 추가
        axios.get(`${API_BASE_URL}/api/chat/${roomId}/productId`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                console.log("fetchProductId 성공 - 응답 데이터:", response.data); // 응답 데이터 확인
                setProductId(response.data.productId); // 서버에서 받은 productId 상태에 저장
            })
            .catch((error) => {
                console.error("Failed to fetch product ID:", error);
            });
    };

    useEffect(() => {
        if (productId) {
            console.log("fetchProductDetail 호출 - productId:", productId); // productId 확인
            const fetchProductDetail = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/products/detailInfo`, {
                        params: { productId }
                    });
                    console.log("fetchProductDetail 성공 - 응답 데이터:", response.data); // 응답 데이터 확인
                    setProductDetail(response.data);
                    setFormData((prevData) => ({
                        ...prevData,
                        price: response.data.price,
                    }));
                    console.log("productDetail", response.data);
                    setLentPrice(response.data.price);
                } catch (err) {
                    console.log("error: ", err);
                }
            };

            fetchProductDetail();
        }
    }, [productId]);

    const chooseLentPeriod = (type, value) => {
        if (type === "startDate") {
            if (endDate) {
                if (value < endDate || value == endDate) {
                    setStartDate(value);
                }
                else {
                    alert("종료일 이전 날짜로 선택해주세요.");
                }
            }
            else {
                setStartDate(value);
            }
        }
        else if (type === "endDate") {
            if (startDate) {
                if (value > startDate || value == startDate) {
                    setEndDate(value);
                }
                else {
                    alert("시작일 이후 날짜로 선택해주세요.");
                }
            }
            else {
                setEndDate(value);
            }
        }
        else {
            console("type 입력 오류");
        }
    }

    useEffect(() => {
        if (startDate && endDate) {
            // 날짜 객체로 변환
            let s_date = new Date(startDate);
            let e_date = new Date(endDate);

            // 두 날짜 간의 시간 차이를 밀리초 단위로 계산
            let diffTime = e_date.getTime() - s_date.getTime();

            // 밀리초를 일 단위로 변환
            let diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;

            console.log(diffDays);
            setLentPeriod(diffDays);
        }
    }, [startDate, endDate]);



    useEffect(() => {
        const token = localStorage.getItem("token");

        const handleBeforeUnload = () => {
            if (token && senderId) {
                leaveRoom(token, senderId);
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            if (token && senderId) {
                leaveRoom(token, senderId);
            }
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [roomId, senderId]);


    const fetchUserInfo = (token) => {
        axios.get(`${API_BASE_URL}/api/users/headerUserInfo`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                const userId = response.data.id;
                setSenderId(userId);
                connectWebSocket(token);
                fetchPreviousMessages(token);
                enterRoom(token, userId);

            })
            .catch((error) => {
                console.error("유저 정보 가져오기 실패:", error);
            });
    };
    useEffect(() => {
        if (stompClientRef.current) {
            stompClientRef.current.subscribe(`/topic/chat/${roomId}`, (message) => {
                const notification = JSON.parse(message.body);
                console.log("WebSocket 메시지 수신:", notification);

                // 상태에 맞게 폼 데이터 업데이트
                if (notification.content.includes("신청이 완료되었습니다")) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        startDate: notification.startDate || prevFormData.startDate,
                        endDate: notification.endDate || prevFormData.endDate,
                        status: "PENDING",
                    }));
                    setIsEditable(false);
                }

                if (notification.content.includes("대여 요청이 승인되었습니다")) {
                    setFormData((prevFormData) => {
                        if (prevFormData.status === "APPROVED") {
                            alert("이미 대여 요청이 승인되었습니다.");
                            return prevFormData; // 상태가 이미 "APPROVED"인 경우 업데이트하지 않음
                        }
                        return {
                            ...prevFormData,
                            status: "APPROVED",
                        };
                    });
                    setIsEditable(false);
                }

                if (notification.content.includes("대여 요청이 거절되었습니다")) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        startDate: "",
                        endDate: "",
                        price: "",
                        location: "",
                        status: "",
                    }));
                    setIsEditable(true);
                }
            });
        }
    }, [roomId, stompClientRef]);


    useEffect(() => {
        if (senderId) {
            console.log("현재 senderId:", senderId); // senderId가 설정될 때마다 로그 출력
        }
    }, [senderId]);
    // 처음 렌더링될 때 화면을 맨 아래로 이동
    useEffect(() => {
        scrollToBottom();
    }, []);


    // 새로운 메시지가 추가될 때마다 화면을 맨 아래로 이동
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchApplicationStatus = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("토큰이 없습니다. 요청을 보낼 수 없습니다.");
                    return;
                }

                const response = await axios.get(`${API_BASE_URL}/api/chat/application/status/${roomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setApplicationStatus(response.data.status);
            } catch (error) {
                console.error("신청서 상태 조회 중 오류 발생:", error);
            }
        };

        fetchApplicationStatus();
    }, [roomId]);

// 메시지 클릭 핸들러
    const handleNotificationClick = (message) => {
        // 메시지에 포함된 신청 데이터
        const { applicationData } = message;

        if (applicationData) {
            // 신청 데이터를 사이드바에 표시
            setFormData({
                startDate: applicationData.startDate,
                endDate: applicationData.endDate,
                price: applicationData.price,
                location: applicationData.location,
                applicantId: applicationData.applicantId,
                lenderId: applicationData.lenderId,
            });

            // 사이드바 열기
            setIsSidebarOpen(true);
        } else {
            console.error("신청 데이터가 메시지에 포함되어 있지 않습니다.");
        }
    };


    // 메시지 이벤트 리스너 추가
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) return; // 보안 확인
            const { type, address } = event.data;
            if (type === 'ADDRESS_SELECTED') {
                console.log('수신된 주소:', address); // 로그 추가
                setFormData((prevData) => ({
                    ...prevData,
                    location: address
                }));
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView();
    };


    const connectWebSocket = (token, retryCount = 0) => {
        if (retryCount >= 3) {
            console.error("STOMP 연결 시도 초과.");
            return;
        }

        const socket = new SockJS(`${API_BASE_URL}/api/ws`);
        const stompClient = Stomp.over(() => socket);

        stompClient.connect(
            { Authorization: `Bearer ${token}` },
            () => {
                stompClient.subscribe(`/topic/chat/${roomId}`, onMessageReceived);
                stompClientRef.current = stompClient;
            },
            (error) => {
                console.error("STOMP 연결 실패:", error);
                setTimeout(() => connectWebSocket(token, retryCount + 1), 3000);
            }
        );
    };

    const fetchChatRoomIds = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token is missing. Cannot fetch chat room IDs.");
            return;
        }

        // 문자열 템플릿을 사용할 때 백틱(`)을 사용해야 합니다.
        axios.get(`${API_BASE_URL}/api/chat/${roomId}`, {
            headers: { Authorization: `Bearer ${token}` }, // Bearer 토큰을 템플릿 리터럴로 올바르게 설정
        })
            .then((response) => {
                const { creatorId, joinerId } = response.data;

                setCreatorId(creatorId);
                setJoinerId(joinerId);

                console.log("Chat Room IDs fetched successfully:");
                console.log("Creator ID:", creatorId);
                console.log("Joiner ID:", joinerId);
            })
            .catch((error) => {
                console.error("Failed to fetch chat room IDs:", error);
            });
    };

    const fetchChatRoomDetails = (token, roomId, userId) => {
        if (!token || !roomId || !senderId) {
            return;
        }
        console.log("fetchChatRoomDetails 함수 호출");
        console.log("전달된 token:", token);
        console.log("전달된 roomId:", roomId);
        console.log("전달된 userId:", userId);

        axios.get(`${API_BASE_URL}/api/chat/${roomId}/details`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId },
        })
            .then(response => {
                console.log("서버 응답 성공");
                console.log("서버 응답 데이터:", response.data);

                const { joinerNickname, joinerProfileImage } = response.data;

                setNickname(joinerNickname || "알 수 없음");
                setProfileImage(joinerProfileImage || "default.jpg"); // 기본 이미지 경로 설정

                console.log("상태 업데이트 완료");
            })
            .catch(error => {
                console.error(" 상세 정보 가져오기 실패");

                if (error.response) {
                    console.error("응답 오류:", error.response.data);
                    console.error("상태 코드:", error.response.status);
                    console.error("헤더:", error.response.headers);
                } else if (error.request) {
                    console.error("요청이 전송되었지만 응답이 없습니다:", error.request);
                } else {
                    console.error("요청 설정 중 오류 발생:", error.message);
                }

                console.error("전체 오류 객체:", error);
            });
    };


    const fetchPreviousMessages = (token) => {
        axios.get(`${API_BASE_URL}/api/chat/messages/${roomId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                setMessages(response.data);
            })
            .catch((error) => {
                console.error("이전 메시지 불러오기 실패:", error);
            });
    };

    const onMessageReceived = (payload) => {
        try {
            // 수신된 메시지가 이미 객체인지, 문자열인지를 확인하고 파싱 여부 결정
            const receivedMessage = typeof payload.body === 'string' ? JSON.parse(payload.body) : payload.body;

            // 메시지 중복 여부 확인 후 메시지 추가
            setMessages((prevMessages) => {
                const isDuplicate = prevMessages.some((msg) => msg.id === receivedMessage.id);
                if (!isDuplicate) {
                    return [...prevMessages, receivedMessage];
                }
                return prevMessages;
            });

            // 메시지가 신청서 카드 형식인지 확인하고 사이드바 열기 및 신청서 데이터 업데이트
            if (receivedMessage.applicationData) {
                console.log("신청서 메시지를 수신했습니다:", receivedMessage);

                const { startDate, endDate, price, location } = receivedMessage.applicationData;

                // 신청서 데이터가 변했을 때만 업데이트하도록 조건 추가
                setFormData((prevFormData) => {
                    if (
                        prevFormData.startDate !== startDate ||
                        prevFormData.endDate !== endDate ||
                        prevFormData.price !== price ||
                        prevFormData.location !== location
                    ) {
                        return {
                            ...prevFormData,
                            startDate: startDate,
                            endDate: endDate,
                            price: price,
                            location: location,
                            status: receivedMessage.applicationData.status,
                        };
                    }
                    return prevFormData;
                });

                // 사이드바를 열어 신청서 내용을 확인할 수 있도록 설정
                setIsSidebarOpen(true);
            }
        } catch (e) {
            console.error("메시지 파싱 중 오류 발생:", e);
        }
    };



    const enterRoom = (token, userId) => {
        axios.post(`${API_BASE_URL}/api/chat/enterRoom/${roomId}/${userId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                console.log(" 입장 성공");
                markMessagesAsRead(token, userId);
            })
            .catch((error) => {
                console.error(" 입장 실패:", error);
            });
    };

    const markMessagesAsRead = (token, userId) => {
        axios.post(`${API_BASE_URL}/api/chat/markMessagesAsRead/${roomId}/${userId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                console.log("상대방 메시지 읽음 처리 요청 성공");
            })
            .catch((error) => {
                console.error("읽음 처리 요청 실패:", error);
            });
    };
    const leaveRoom = (token, userId) => {
        const url = `${API_BASE_URL}/api/chat/leaveRoom/${roomId}/${userId}`;
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        navigator.sendBeacon(url, JSON.stringify({ headers }));
        console.log(" 퇴장 요청 전송됨");

        if (window.opener) {
            console.log("메시지 전송: ChatWindow에서 ChatHome으로 나가기 알림");
            window.opener.postMessage({ roomId, action: 'leave' }, '*');
        }
    };
    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };


    const openMidPointWindow = () => {
        window.open(`/ChatMidPoint?roomId=${roomId}`, '_blank', 'width=700,height=600');
    };

    const handleSendMessage = async () => {
        const token = localStorage.getItem("token");
        if (!senderId || !token) {
            console.error("메시지를 전송할 수 없습니다.");
            return;
        }

        if (!stompClientRef.current || !stompClientRef.current.connected) {
            console.warn("WebSocket이 연결되지 않았습니다. 연결을 시도합니다.");
            connectWebSocket(token);
            return;
        }

        const newMessage = {
            id: `${roomId}-${Date.now()}`,
            chatRoomId: roomId,
            senderId: senderId,
            content: message,
            timestamp: new Date().toISOString(),
        };

        console.log("메시지 전송 요청:", newMessage);

        try {
            const response = await axios.get(`${API_BASE_URL}/api/chat/isUserInRoom/${roomId}/${senderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            newMessage.isRead = response.data;

            await axios.post(`${API_BASE_URL}/api/chat/send`, newMessage, {
                headers: { Authorization: `Bearer ${token}` },
            });

            stompClientRef.current.send(`/topic/chat/${roomId}`, {}, JSON.stringify(newMessage));
            setMessage('');
            console.log("메시지 전송 성공:", newMessage);
        } catch (error) {
            console.error("메시지 전송 중 오류:", error);
        }
    };


    const fetchChatRoomParticipants = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token is missing. Cannot fetch chat room participants.");
            return;
        }

        axios.get(`${API_BASE_URL}/api/chat/${roomId}/participants`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                const { creatorName, joinerName } = response.data;

                // 폼 데이터 업데이트
                setFormData((prevData) => ({
                    ...prevData,
                    applicant: joinerName,
                    lender: creatorName
                }));

                console.log("Participant names fetched successfully:");
                console.log("Creator Name:", creatorName);
                console.log("Joiner Name:", joinerName);
            })
            .catch((error) => {
                console.error("Failed to fetch participant names:", error);
            });
    };

    const checkApplicationExists = async (chatRoomId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${API_BASE_URL}/api/chat/application/exists/${chatRoomId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.exists; // 서버에서 "exists" 필드로 반환받는다고 가정
        } catch (error) {
            console.error("신청서 존재 여부 확인 중 오류 발생:", error);
            return false; // 오류가 발생하면 false로 반환 (즉, 신청서가 없다고 가정)
        }
    };

    const handleApply = async () => {
        const token = localStorage.getItem("token"); // JWT 토큰 가져오기
        if (!token) {
            console.error("토큰이 없습니다. 요청을 보낼 수 없습니다.");
            alert("로그인 후 다시 시도해주세요.");
            return;
        }

        // 신청 전 대여 기간 확인
        if (!formData.startDate || !formData.endDate) {
            alert("대여 시작일과 종료일을 모두 선택해주세요.");
            return;
        }

        // 로그로 확인
        console.log("handleApply 호출됨");
        console.log("roomId:", roomId);
        console.log("formData:", formData);
        console.log("senderId:", senderId);
        console.log("joinerId:", joinerId);

        // 렌트 가격이 비어 있을 경우 초기 값으로 설정 (불변성을 유지)
        if (!formData.price) {
            setFormData(prevFormData => ({
                ...prevFormData,
                price: lentPrice,
            }));
        }

        try {
            // 신청서 존재 여부 확인 요청
            const checkResponse = await axios.get(
                `${API_BASE_URL}/api/chat/exists/${roomId}`, // 신청서 존재 여부 확인 경로
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // JWT 토큰 추가
                    },
                }
            );

            if (checkResponse.data) {
                alert("신청 중입니다.");
                return;
            }

            const applicationData = {
                chatRoomId: roomId,
                startDate: formData.startDate,
                endDate: formData.endDate,
                price: formData.price,
                location: formData.location,
                applicantId: creatorId, // 신청인 ID 설정
                lenderId: joinerId, // 대여자 ID 설정
                status: "PENDING",
            };

            // applicationData 내용 확인
            console.log("applicationData:", applicationData);

            // 신청 데이터 전송
            const response = await axios.post(
                `${API_BASE_URL}/api/chat/application/create`,
                applicationData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // JWT 토큰 추가
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("신청 성공:", response.data);
            alert("신청이 성공적으로 처리되었습니다.");

            // 신청서가 생성되었으므로 수정 불가 상태로 설정
            setIsEditable(false);
            setIsSidebarOpen(false); // 빌리기를 통해서 들어갈 때 사이드바를 자동으로 엽니다.

            // 신청이 완료되면 상대방에게 알림 메시지 전송
            const notificationMessage = {
                id: `${roomId}-${Date.now()}`,
                chatRoomId: roomId,
                senderId: senderId,
                content: `신청이 완료되었습니다. ${formData.startDate}부터 ${formData.endDate}까지 대여를 신청했습니다.`,
                timestamp: new Date().toISOString(),
                isRead: false, // 알림 메시지 초기 상태는 읽지 않음으로 설정
            };

            // stompClientRef를 사용하여 WebSocket을 통해 메시지 전송
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.send(`/topic/chat/${roomId}`, {}, JSON.stringify(notificationMessage));
                console.log("알림 메시지 WebSocket 전송 성공:", notificationMessage);
            } else {
                console.warn("WebSocket이 연결되지 않았습니다. 연결을 시도합니다.");
                connectWebSocket(token);
            }

            // 서버에 알림 메시지 저장
            await axios.post(`${API_BASE_URL}/api/chat/send`, notificationMessage, {
                headers: { Authorization: `Bearer ${token}` },
            });

        } catch (error) {
            console.error("신청 처리 중 오류 발생:", error.response ? error.response.data : error.message);
            alert("신청 처리 중 문제가 발생했습니다.");
        }
    };




// formData의 startDate와 endDate가 변경되었을 때 startDate, endDate 상태를 업데이트
    useEffect(() => {
        setStartDate(formData.startDate);
        setEndDate(formData.endDate);
    }, [formData]);

    const formatDateForInput = (dateString) => {
        // 초 부분을 제거하고 'yyyy-MM-ddTHH:mm' 형식으로 반환
        return dateString.slice(0, 16);
    };

// price에 천단위 콤마 추가
    const priceAddComma = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const handleAccept = async () => {
        const token = localStorage.getItem("token"); // JWT 토큰 가져오기
        if (!token) {
            console.error("토큰이 없습니다. 요청을 보낼 수 없습니다.");
            alert("로그인 후 다시 시도해주세요.");
            return;
        }

        // 로그로 확인
        console.log("handleAccept 호출됨");
        console.log("roomId:", roomId);
        console.log("senderId:", senderId);
        console.log("joinerId:", joinerId);

        try {
            // 신청서 존재 여부 확인 요청
            const checkResponse = await axios.get(
                `${API_BASE_URL}/api/chat/exists/${roomId}`, // 신청서 존재 여부 확인 경로
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // JWT 토큰 추가
                    },
                }
            );

            if (!checkResponse.data) {
                alert("신청서가 존재하지 않습니다.");
                return;
            }

            // 빌려주기 상태 업데이트를 서버에 요청 (PATCH 요청 사용)
            const response = await axios.patch(
                `${API_BASE_URL}/api/chat/application/updateStatusByRoomId/${roomId}`,
                null, // 요청 본문이 필요하지 않음
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // JWT 토큰 추가
                    },
                    params: {
                        status: "APPROVED" // 상태를 "APPROVED"로 설정
                    }
                }
            );

            if (response.status === 409) {
                alert("이미 대여 승인이 완료되었습니다.");
                return;
            }

            console.log("빌려주기 성공:", response.data);
            alert("빌려주기가 성공적으로 처리되었습니다.");
            setIsSidebarOpen(false); // 빌리기를 통해서 들어갈 때 사이드바를 자동으로 엽니다.

            // 상대방에게 알림 메시지 전송
            const notificationMessage = {
                id: `${roomId}-${Date.now()}`,
                chatRoomId: roomId,
                senderId: senderId,
                content: `대여 요청이 승인되었습니다.`,
                timestamp: new Date().toISOString(),
                isRead: false, // 알림 메시지 초기 상태는 읽지 않음으로 설정
            };

            // stompClientRef를 사용하여 WebSocket을 통해 메시지 전송
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.send(`/topic/chat/${roomId}`, {}, JSON.stringify(notificationMessage));
                console.log("승인 알림 메시지 WebSocket 전송 성공:", notificationMessage);
            } else {
                console.warn("WebSocket이 연결되지 않았습니다. 연결을 시도합니다.");
                connectWebSocket(token);
            }

            // 서버에 알림 메시지 저장
            await axios.post(`${API_BASE_URL}/api/chat/send`, notificationMessage, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error("빌려주기 처리 중 오류 발생:", error);
            // 서버에서 404 오류가 발생하면 신청서가 없다고 알림
            if (error.response && error.response.status === 404) {
                alert("신청서를 찾을 수 없습니다. 이미 삭제되었을 수 있습니다.");
            } else if (error.response && error.response.status === 409) {
                alert("이미 대여 승인이 완료되었습니다.");
            } else {
                alert("빌려주기 처리 중 문제가 발생했습니다.");
            }
        }
    };

// 대여 반납 요청 함수 정의
    const handleReturnRequest = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("토큰이 없습니다. 요청을 보낼 수 없습니다.");
                alert("로그인 후 다시 시도해주세요.");
                return;
            }

            // 반납 요청을 서버로 전송
            const response = await axios.post(
                `${API_BASE_URL}/api/chat/application/return/${roomId}`, // 반납 요청 엔드포인트
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("반납 요청 성공:", response.data);
            alert("반납 요청이 성공적으로 처리되었습니다.");
            setApplicationStatus("RETURN_REQUESTED"); // 반납 요청 상태 업데이트
        } catch (error) {
            console.error("반납 요청 처리 중 오류 발생:", error);
            alert("반납 요청 처리 중 문제가 발생했습니다.");
        }
    };


    const handleReject = async () => {
        const token = localStorage.getItem("token"); // JWT 토큰 가져오기
        if (!token) {
            console.error("토큰이 없습니다. 요청을 보낼 수 없습니다.");
            alert("로그인 후 다시 시도해주세요.");
            return;
        }

        // 로그로 확인
        console.log("handleReject 호출됨");
        console.log("roomId:", roomId);
        console.log("senderId:", senderId);
        console.log("joinerId:", joinerId);

        try {
            // 신청서 존재 여부 확인 요청
            const checkResponse = await axios.get(
                `${API_BASE_URL}/api/chat/exists/${roomId}`, // 신청서 존재 여부 확인 경로
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // JWT 토큰 추가
                    },
                }
            );

            if (!checkResponse.data) {
                alert("신청서가 존재하지 않습니다.");
                return;
            }

            // 거절 상태를 서버에 요청 (DELETE 요청 사용)
            const response = await axios.delete(
                `${API_BASE_URL}/api/chat/delete/${roomId}`, // DELETE 요청 경로
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // JWT 토큰 추가
                    },
                }
            );

            console.log("거절 성공:", response.data);
            alert("거절이 성공적으로 처리되었습니다.");
            setIsSidebarOpen(false); // 빌리기를 통해서 들어갈 때 사이드바를 자동으로 엽니다.
            setIsEditable(true);

            // 시작일, 종료일, 가격, 장소 초기화
            setFormData((prevFormData) => ({
                ...prevFormData,
                startDate: "",
                endDate: "",
                price: "",
                location: "",
            }));

            // 거절이 완료되면 상대방에게 알림 메시지 전송
            const notificationMessage = {
                id: `${roomId}-${Date.now()}`,
                chatRoomId: roomId,
                senderId: senderId,
                content: `대여 요청이 거절되었습니다.`,
                timestamp: new Date().toISOString(),
                isRead: false, // 알림 메시지 초기 상태는 읽지 않음으로 설정
            };

            // stompClientRef를 사용하여 WebSocket을 통해 메시지 전송
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.send(`/topic/chat/${roomId}`, {}, JSON.stringify(notificationMessage));
                console.log("거절 알림 메시지 WebSocket 전송 성공:", notificationMessage);
            } else {
                console.warn("WebSocket이 연결되지 않았습니다. 연결을 시도합니다.");
                connectWebSocket(token);
            }

            // 서버에 알림 메시지 저장
            await axios.post(`${API_BASE_URL}/api/chat/send`, notificationMessage, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error("거절 처리 중 오류 발생:", error);
            alert("거절 처리 중 문제가 발생했습니다.");
        }
    };

    const handleReturnConfirmation = async () => {
        const token = localStorage.getItem("token"); // JWT 토큰 가져오기
        if (!token) {
            console.error("토큰이 없습니다. 요청을 보낼 수 없습니다.");
            alert("로그인 후 다시 시도해주세요.");
            return;
        }

        // 로그로 확인
        console.log("handleReturnConfirmation 호출됨");
        console.log("roomId:", roomId);
        console.log("senderId:", senderId);
        console.log("joinerId:", joinerId);

        try {
            // 신청서 존재 여부 확인 요청
            const checkResponse = await axios.get(
                `${API_BASE_URL}/api/chat/exists/${roomId}`, // 신청서 존재 여부 확인 경로
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // JWT 토큰 추가
                    },
                }
            );

            if (!checkResponse.data) {
                alert("신청서가 존재하지 않습니다.");
                return;
            }

            // 반납 상태 업데이트를 서버에 요청 (PATCH 요청 사용)
            const response = await axios.patch(
                `${API_BASE_URL}/api/chat/application/updateStatusByRoomId/${roomId}`,
                null, // 요청 본문이 필요하지 않음
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // JWT 토큰 추가
                    },
                    params: {
                        status: "RETURNED" // 상태를 "RETURNED"로 설정
                    }
                }
            );

            if (response.status === 409) {
                alert("이미 반납 처리가 완료되었습니다.");
                return;
            }

            console.log("반납 확인 성공:", response.data);
            alert("반납이 성공적으로 처리되었습니다.");
            setIsSidebarOpen(false); // 반납 확인을 통해 사이드바를 닫습니다.

            // 상대방에게 알림 메시지 전송
            const notificationMessage = {
                id: `${roomId}-${Date.now()}`,
                chatRoomId: roomId,
                senderId: senderId,
                content: `반납이 완료되었습니다.`,
                timestamp: new Date().toISOString(),
                isRead: false, // 알림 메시지 초기 상태는 읽지 않음으로 설정
            };

            // stompClientRef를 사용하여 WebSocket을 통해 메시지 전송
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.send(`/topic/chat/${roomId}`, {}, JSON.stringify(notificationMessage));
                console.log("반납 알림 메시지 WebSocket 전송 성공:", notificationMessage);
            } else {
                console.warn("WebSocket이 연결되지 않았습니다. 연결을 시도합니다.");
                connectWebSocket(token);
            }

            // 서버에 알림 메시지 저장
            await axios.post(`${API_BASE_URL}/api/chat/send`, notificationMessage, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error("반납 처리 중 오류 발생:", error);
            // 서버에서 404 오류가 발생하면 신청서가 없다고 알림
            if (error.response && error.response.status === 404) {
                alert("신청서를 찾을 수 없습니다. 이미 삭제되었을 수 있습니다.");
            } else if (error.response && error.response.status === 409) {
                alert("이미 반납 처리가 완료되었습니다.");
            } else {
                alert("반납 처리 중 문제가 발생했습니다.");
            }
        }
    };


    return (
        <div className={style.chatWindow}>
            <div className={style.messagesContainer}>
                {messages.map((msg, index) => {
                    const isDuplicate = index > 0 &&
                        messages[index - 1].content === msg.content &&
                        messages[index - 1].timestamp === msg.timestamp &&
                        messages[index - 1].senderId === msg.senderId;

                    if (isDuplicate) return null;

                    const isFirstMessageOfParticipant =
                        msg.senderId !== senderId &&
                        (index === 0 || messages[index - 1].senderId === senderId);

                    const isLastMessage = index === messages.length - 1;
                    const isLastInSameMinute =
                        isLastMessage ||
                        new Date(messages[index + 1].timestamp).getMinutes() !== new Date(msg.timestamp).getMinutes() ||
                        new Date(messages[index + 1].timestamp).getHours() !== new Date(msg.timestamp).getHours();

                    const shouldShowTimestamp =
                        (msg.senderId === senderId && isLastInSameMinute) ||
                        (msg.senderId !== senderId && isLastInSameMinute);
                    const isNotification = msg.isNotification === true;

                    return (
                        <div key={msg.id || `${msg.timestamp}-${index}`} className={`${style.messageWrapper} ${isFirstMessageOfParticipant ? style.firstMessageWrapper : ''}`}
                             onClick={() => {
                                 if (isNotification) {
                                     handleNotificationClick(msg);
                                 }
                             }}
                             style={{ cursor: isNotification ? 'pointer' : 'default' }} // 알림 메시지일 때만 클릭 가능하도록 마우스 커서 설정
                        >
                            {msg.senderId !== senderId && (
                                <div className={style.profileImageContainer}>
                                    {isFirstMessageOfParticipant && (
                                        <img src={`${API_BASE_URL}/api/profileImagePath/${profileImage}`} alt="프로필"
                                             className={style.profileImage}/>
                                    )}
                                </div>
                            )}
                            {isFirstMessageOfParticipant ? (
                                <div className={style.firstMessageContainer}>
                                    <div className={style.nicknameAboveMessage}>{nickname}</div>
                                    <div className={style.messageAndTimestamp}>
                                        <div className={style.theirMessageBubble}>{msg.content}</div>
                                        {shouldShowTimestamp && (
                                            <div className={style.messageTimestamp}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={msg.senderId === senderId ? style.myMessageContainer : style.theirMessageContainer}>
                                    {msg.senderId === senderId ? (
                                        <>
                                            {shouldShowTimestamp && (
                                                <div className={style.messageTimestamp}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    })}
                                                </div>
                                            )}
                                            <div className={style.myMessageBubble}>{msg.content}</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={style.theirMessageBubble}>{msg.content}</div>
                                            {shouldShowTimestamp && (
                                                <div className={style.messageTimestamp}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    })}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef}/>
            </div>

            <div className={style.inputContainer}>
                <button onClick={openMidPointWindow} className={style.locationButton}>
                    <FontAwesomeIcon icon={faMapMarkerAlt}/>
                </button>

                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className={style.messageInput}
                    rows="1"
                />
                <button onClick={handleSendMessage} className={style.sendButton} disabled={!message.trim()}>전송</button>
            </div>

            {/* 우측 상단 메뉴 버튼 */}
            <button onClick={handleToggleSidebar} className={style.menuButton}>
                <FontAwesomeIcon icon={faBars} />
            </button>
            <div id="applicationForm" className={style.sidebar}>

                {/* 신청서 사이드바 */}
                <div className={`${style.sidebar} ${isSidebarOpen ? style.sidebarOpen : ''}`}>
                    <h2>신청서</h2>
                    <div className={style.formGroup}>
                        <label className={style.inlineLabel}>대여 기간:</label>
                        <div className={style.product_start_end_date_input_wrap}>
                            <input
                                className={`${style.productStartDate} ${style.input_date}`}
                                type="date"
                                value={startDate || ""} // 시작 날짜를 기본값으로 설정
                                disabled={!isEditable} // 신청서가 존재하면 수정 불가

                                min={productDetail && productDetail.startDate ? formatDateForInput(productDetail.startDate) : ""}
                                max={productDetail && productDetail.endDate ? formatDateForInput(productDetail.endDate) : ""}
                                onChange={(e) => {
                                    chooseLentPeriod("startDate", e.target.value);
                                }}
                                onKeyDown={(e) => e.preventDefault()}
                            />

                            <span className={style.tilde}>~</span>
                            <input
                                className={`${style.productEndDate} ${style.input_date}`}
                                type="date"
                                value={endDate || ""} // 끝나는 날짜를 기본값으로 설정
                                disabled={!isEditable} // 신청서가 존재하면 수정 불가

                                min={productDetail && productDetail.startDate ? formatDateForInput(productDetail.startDate) : ""}
                                max={productDetail && productDetail.endDate ? formatDateForInput(productDetail.endDate) : ""}
                                onChange={(e) => {
                                    chooseLentPeriod("endDate", e.target.value);
                                }}
                                onKeyDown={(e) => e.preventDefault()}
                            />
                        </div>
                    </div>

                    <div className={style.formGroup}>
                        <label>일수:</label>
                        <div className={style.product_lentPeriod_display_wrap}>
                            <div className={style.product_lentPeriod_value_wrap}>
                                {startDate && endDate ? (
                                    <>
                                        {lentPeriod}일
                                    </>
                                ) : (
                                    <>
                                        기간
                                    </>
                                )}
                            </div>
                        </div>

                        <label>대여 가격:</label>
                        <div className={style.product_price_value_wrap}>
                            {priceAddComma(lentPrice)}원
                        </div>
                    </div>

                    <div className={style.formGroup}>
                        <label>거래 장소:</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location || ""}
                            onChange={handleFormChange}
                            disabled={!isEditable} // 신청서가 존재하면 수정 불가
                            placeholder="거래 장소 입력"
                            className={style.input_text}
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label>신청인:</label>
                        <input
                            type="text"
                            name="applicant"
                            value={formData.applicant || ""}
                            onChange={handleFormChange}
                            disabled={!isEditable} // 신청서가 존재하면 수정 불가
                            className={style.inputApplicant}
                        />
                        <label>대여자:</label>
                        <input
                            type="text"
                            name="lender"
                            value={formData.lender || ""}
                            onChange={handleFormChange}
                            disabled={!isEditable} // 신청서가 존재하면 수정 불가
                            className={style.inputLender}
                        />
                    </div>

                    <div className={style.submitButtonContainer}>
                        {/* creatorId인 경우 */}
                        {senderId === creatorId && (
                            <>
                                {!applicationStatus && (
                                    <button
                                        onClick={() => {
                                            if (!startDate || !endDate) {
                                                alert("대여 시작일과 종료일을 모두 선택해주세요.");
                                                return;
                                            }
                                            handleApply(); // "신청하기" 버튼 동작
                                        }}
                                        className={style.submitButton}
                                    >
                                        신청하기
                                    </button>
                                )}
                                {applicationStatus === "PENDING" && (
                                    <button className={style.submitButton} disabled>
                                        신청 중
                                    </button>
                                )}
                                {applicationStatus === "APPROVED" && (
                                    <button
                                        onClick={() => {
                                            if (new Date(startDate) <= today) {
                                                handleReturnRequest(); // 반납 요청
                                            } else {
                                                alert("아직 대여 기간이 시작되지 않았습니다.");
                                            }
                                        }}
                                        className={style.submitButton}
                                    >
                                        신청 완료
                                    </button>
                                )}
                                {applicationStatus === "RETURNED" && (
                                    <button className={style.submitButton} disabled>
                                        거래 완료
                                    </button>
                                )}
                            </>
                        )}
                        {/* joinerId인 경우 "빌려주기" 및 "거절하기" 버튼 표시 */}
                        {senderId === joinerId && (
                            <div className={style.acceptRejectContainer}>
                                {applicationStatus === "RETURNED" ? (
                                    <button className={style.submitButton} disabled>
                                        거래 완료
                                    </button>
                                ) : applicationStatus === "APPROVED" ? (
                                    <button
                                        onClick={() => {
                                            handleReturnConfirmation(); // "반납 확인" 버튼 동작
                                        }}
                                        className={style.submitButton}
                                    >
                                        반납 확인
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleAccept(); // "빌려주기" 버튼 동작
                                            }}
                                            className={style.acceptButton}
                                        >
                                            빌려주기
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleReject(); // "거절하기" 버튼 동작
                                            }}
                                            className={style.rejectButton}
                                        >
                                            거절하기
                                        </button>
                                    </>
                                )}
                            </div>
                        )}


                        {/* creatorId와 joinerId가 둘 다 아닌 경우 */}
                        {senderId !== creatorId && senderId !== joinerId && (
                            <button className={style.submitButton} disabled>
                                버튼 없음
                            </button>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default ChatWindow;
