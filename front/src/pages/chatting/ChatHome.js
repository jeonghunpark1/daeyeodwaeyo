import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import style from '../../styles/chatting/ChatHome.module.css';

const ChatHome = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [stompClient, setStompClient] = useState(null);
    const openChatWindows = useRef({}); // 열린 채팅창을 추적하는 객체

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedLoginStatus = localStorage.getItem("isLogin") === "true";

        if (token && storedLoginStatus) {
            setIsLogin(true);
            fetchUserInfo(token);
        } else {
            setIsLogin(false);
            setUserInfo(null);
        }
    }, []);

    useEffect(() => {
        if (userInfo) {
            const token = localStorage.getItem("token");
            connectWebSocket(token);
        }

        return () => {
            if (stompClient) stompClient.disconnect();
        };
    }, [userInfo]);

    const fetchUserInfo = (token) => {
        axios.get('http://localhost:8080/api/users/headerUserInfo', {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then((response) => {
                setIsLogin(true);
                setUserInfo(response.data);
                fetchChatRooms(token, response.data.id);
            })
            .catch((err) => {
                console.error('유저 정보 가져오기 실패:', err);
                setIsLogin(false);
                setUserInfo(null);
            });
    };

    const fetchChatRooms = (token, userId) => {
        axios.get(`http://localhost:8080/Chat/myChatRooms/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                const chatRooms = response.data.map(room => ({
                    id: room.chatRoomId,
                    profileImage: room.joinerProfileImage,
                    nickname: room.joinerNickname,
                    lastMessage: room.lastMessage,
                    lastMessageTime: room.lastMessageTimestamp,
                    unreadCount: room.unreadCount,
                }));
                setChatRooms(chatRooms);
                console.log(response.data);
            })
            .catch(error => console.error('채팅방 목록 불러오기 실패:', error));
    };

    const connectWebSocket = (token) => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);

        client.connect({ Authorization: `Bearer ${token}` }, () => {
            setStompClient(client);
            client.subscribe(`/topic/chatRooms`, (message) => {
                const updatedMessage = JSON.parse(message.body);
                console.log("ChatHome에서 수신된 메시지:", updatedMessage);
                updateChatRooms(updatedMessage);
            });
            console.log("WebSocket에 연결되고 /topic/chatRooms에 구독 완료");
        }, (error) => console.error("WebSocket 연결 실패:", error));
    };

    const updateChatRooms = (newMessage) => {
        console.log("updateChatRooms - 수신된 메시지:", newMessage);
        setChatRooms((prevRooms) => {
            return prevRooms.map((room) => {
                if (room.id === newMessage.chatRoomId) {
                    const isOwnMessage = newMessage.senderId === userInfo.id;
                    return {
                        ...room,
                        lastMessage: newMessage.content,
                        lastMessageTime: newMessage.timestamp,
                        unreadCount: isOwnMessage ? newMessage.senderUnreadCount : newMessage.receiverUnreadCount,
                    };
                }
                return room;
            });
        });
    };

    const handleRoomClick = (roomId, profileImage, nickname) => {
        setChatRooms((prevRooms) => {
            return prevRooms.map((room) => {
                if (room.id === roomId) {
                    return { ...room, unreadCount: 0 };
                }
                return room;
            });
        });

        const chatRoomUrl = `/ChatWindow/${roomId}?profileImage=${encodeURIComponent(profileImage)}&nickname=${encodeURIComponent(nickname)}`;

        // 이미 열린 창이 있는지 확인하고 포커스 또는 새 창 열기
        if (openChatWindows.current[roomId] && !openChatWindows.current[roomId].closed) {
            console.log(`포커스 됩니다: ${roomId}`);
            openChatWindows.current[roomId].focus();
        } else {
            console.log(`새 창을 엽니다: ${roomId}`);
            openChatWindows.current[roomId] = window.open(chatRoomUrl, `ChatWindow_${roomId}`, 'width=400,height=600');

            if (!openChatWindows.current[roomId]) {
                console.error("새 창을 열 수 없습니다. 팝업 차단이 설정되었을 수 있습니다.");
            } else {
                console.log("새 창이 성공적으로 열렸습니다.");
            }
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';

        const date = new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const isPM = hours >= 12;

        hours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${isPM ? '오후' : '오전'} ${hours}:${formattedMinutes}`;
    };

    const requestProfileImageURL = (profileImage) => {
      const profileImageURL = "http://localhost:8080/profileImagePath/" + profileImage;
      return profileImageURL;
    };

    return (
        <div className={style['chat-home-container']}>
            {userInfo && (
                <div className={style['chat-room-item']}>
                    <div className={style['profile-container']}>
                        <div className={style['profile-image-wrapper']}>
                            <img src={requestProfileImageURL(userInfo.profileImage)} alt="프로필"/>
                        </div>
                    </div>
                    <div className={style['info-container']}>
                        <div className={style['nickname']}>
                            {userInfo.nickName}
                        </div>
                    </div>
                </div>
            )}

            <div className={style['divider']} />

            <div className={style['chat-room-list']}>
                <ul>
                    {chatRooms.map((room) => (
                        <li
                            key={room.id}
                            className={style['chat-room-item']}
                            onClick={() => handleRoomClick(room.id, room.profileImage, room.nickname)}
                        >
                            <div className={style['chat-room-content']}>
                                <div className={style['profile-image-wrapper']}>
                                    <img src={requestProfileImageURL(room.profileImage)} alt="프로필" className={style['profile-image']} />
                                </div>
                                <div className={style['text-container']}>
                                    <div className={style['nickname']}>{room.nickname}</div>
                                    <div className={style['last-message']}>{room.lastMessage}</div>
                                </div>
                                <div className={style['right-container']}>
                                    <div className={style['message-time']}>{formatTime(room.lastMessageTime)}</div>
                                    {room.unreadCount > 0 && (
                                        <div className={style['unread-count']}>
                                            {room.unreadCount}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChatHome;
