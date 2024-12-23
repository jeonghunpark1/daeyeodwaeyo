import React, { useRef } from 'react';
import style from '../../styles/chatting/Chat.module.css';

const Chat = ( {chatWindowRef} ) => {
    // 열린 창을 추적하는 useRef
    // const chatWindowRef = useRef(null);

    // ChatHome 페이지로 이동하는 함수
    const openChatHome = () => {
        const chatHomeUrl = '/ChatHome';

        // 이미 열린 창이 있는지 확인
        if (chatWindowRef.current && !chatWindowRef.current.closed) {
            console.log("이미 열린 창이 있습니다. 포커스를 맞춥니다.");
            chatWindowRef.current.focus();
        } else {
            console.log("새 창을 엽니다.");
            // 새 창 열기 및 ref에 저장
            chatWindowRef.current = window.open(chatHomeUrl, 'ChatHome', 'width=400,height=600');

            if (!chatWindowRef.current) {
                console.error("새 창을 열 수 없습니다. 팝업 차단이 설정되었을 수 있습니다.");
            } else {
                console.log("새 창이 성공적으로 열렸습니다.");
            }
        }
    };

    return (
        <div className={style.chatButton} onClick={openChatHome}>
            💬 {/* 채팅 홈 페이지 이동 버튼 */}
        </div>
    );
};

export default Chat;
