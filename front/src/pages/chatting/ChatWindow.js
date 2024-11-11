import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import style from '../../styles/chatting/ChatWindow.module.css';
// FontAwesomeIcon과 faLocationArrow를 올바르게 가져옵니다.


const ChatWindow = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const stompClientRef = useRef(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [senderId, setSenderId] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [nickname, setNickname] = useState(null);
    const messagesEndRef = useRef(null);

    // 처음 렌더링될 때 화면을 맨 아래로 이동
    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUserInfo(token);
        }
    }, []);

    // 새로운 메시지가 추가될 때마다 화면을 맨 아래로 이동
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setProfileImage(queryParams.get("profileImage"));
        setNickname(queryParams.get("nickname"));
    }, [location]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView();
    };

    const fetchUserInfo = (token) => {
        axios.get('http://localhost:8080/api/users/headerUserInfo', {
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

    const fetchPreviousMessages = (token) => {
        axios.get(`http://localhost:8080/Chat/messages/${roomId}`, {
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
        const receivedMessage = JSON.parse(payload.body);
        setMessages((prevMessages) => {
            const isDuplicate = prevMessages.some((msg) => msg.id === receivedMessage.id);
            if (!isDuplicate) {
                return [...prevMessages, receivedMessage];
            }
            return prevMessages;
        });
    };

    const connectWebSocket = (token, retryCount = 0) => {
        if (retryCount >= 3) {
            console.error("STOMP 연결 시도 초과.");
            return;
        }

        const socket = new SockJS('http://localhost:8080/ws');
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

    const enterRoom = (token, userId) => {
        axios.post(`http://localhost:8080/Chat/enterRoom/${roomId}/${userId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                console.log("채팅방 입장 성공");
                markMessagesAsRead(token, userId);
            })
            .catch((error) => {
                console.error("채팅방 입장 실패:", error);
            });
    };

    const markMessagesAsRead = (token, userId) => {
        axios.post(`http://localhost:8080/Chat/markMessagesAsRead/${roomId}/${userId}`, {}, {
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
        const url = `http://localhost:8080/Chat/leaveRoom/${roomId}/${userId}`;
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        navigator.sendBeacon(url, JSON.stringify({ headers }));
        console.log("채팅방 퇴장 요청 전송됨");

        if (window.opener) {
            console.log("메시지 전송: ChatWindow에서 ChatHome으로 나가기 알림");
            window.opener.postMessage({ roomId, action: 'leave' }, '*');
        }
    };

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
            const response = await axios.get(`http://localhost:8080/Chat/isUserInRoom/${roomId}/${senderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const isUserInRoom = response.data;
            newMessage.isRead = isUserInRoom;

            await axios.post('http://localhost:8080/Chat/send', newMessage, {
                headers: { Authorization: `Bearer ${token}` },
            });

            stompClientRef.current.send(`/topic/chat/${roomId}`, {}, JSON.stringify(newMessage));
            setMessage('');
            console.log("메시지 전송 성공:", newMessage);
        } catch (error) {
            console.error("메시지 전송 중 오류:", error);
        }
    };

    // 중간거리 찾기 창 열기 함수 (roomId 전달)
    const openMidPointWindow = () => {
        window.open(`/ChatMidPoint?roomId=${roomId}`, '_blank', 'width=700,height=600');
    };

    const requestProfileImageURL = (profileImage) => {
      const profileImageURL = "http://localhost:8080/profileImagePath/" + profileImage;
      return profileImageURL;
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

                    return (
                        <div key={msg.id || `${msg.timestamp}-${index}`}
                             className={`${style.messageWrapper} ${isFirstMessageOfParticipant ? style.firstMessageWrapper : ''}`}>
                            {msg.senderId !== senderId && (
                                <div className={style.profileImageContainer}>
                                    {isFirstMessageOfParticipant && (
                                        <img src={requestProfileImageURL(profileImage)} alt="프로필"
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
        </div>
    );
};

export default ChatWindow;
