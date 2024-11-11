import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';

import style from "../../styles/signup/signupCertification.module.css"
import input_style from "../../styles/login_signup_input.module.css"

export default function SignUpCertification({ setStateValue, getStateValue, setStateValid, getStateValid }) {

  const email = getStateValue("emailId") + "@" + getStateValue("emailDomain");

  const [checkCertificationNumber, setCheckCertificationNumber] = useState(false);

  // 타이머 시간 3분
  const initialTime = 180;
  
  // 남은 시간 관리
  const [remainingTime, setRemainingTime] = useState(0);

  const certificationNumberRef = useRef(getStateValid("certificationNumber"));

  useEffect(() => {
    certificationNumberRef.current = getStateValid("certificationNumber");
  }, [getStateValid("certificationNumber")]);


  useEffect(() => {
    if (remainingTime > 0 && !getStateValid("certificationNumber")) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      clearInterval();
    }
  }, [remainingTime, getStateValid("certificationNumber")]);

  // 시간을 분, 초로 변환하는 함수
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // 재전송 버튼을 클릭했을 때 호출되는 함수
  const handleEmailSendClick = () => {
    // 남은 시간을 다시 180초로 재설정
    setRemainingTime(initialTime);
  }

  // 입력한 이메일로 인증 코드를 정송하는 함수
  const sendEmail = async () => {
    console.log("email", {email});
    console.log("isEmailSend: ", getStateValid("isEmailSend"));
    try {
      const response = await axios.post('http://localhost:8080/api/email/sendCode', {email}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true // 클라이언트와 서버가 통신할 때 쿠키와 같은 인증 정보 값을 공유하겠다는 설정
      });
      if(response && response.data) {
        alert(response.data); // 성공 메시지 출력
        setStateValid("isEmailSend", true);
        setRemainingTime(initialTime);
      } else {
        throw new Error("서버로부터 유효한 응답을 받지 못했습니다.");
      }
    } catch (err) {
      alert("인증코드 전송 실패: ")
    }
  }

  // 인증번호 확인하는 함수
  const checkVerificationCode = async () => {
    const code = getStateValue("certificationNumber");
    try {
      const response = await axios.post('http://localhost:8080/api/email/checkCode', {code}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      if(response && response.data) {
        alert(response.data);
        setStateValid("certificationNumber", true);
      } else {
        throw new Error("서버로부터 유효한 응답을 받지 못했습니다.");
      }
    } catch (err) {
      alert("인증코드 불일치");
    }
  }

  return (
    <div className={style.signup_div}>
      <h1>
        <div>이메일 인증</div>
      </h1>
      <div className={style.input_wrap_div}>
        <div className={`${style.email_input_wrap} ${input_style.input_wrap}`}>
          <div className={style.email_top_input_wrap}>
            <div className={style.emailId_input_wrap}>
              <input className={`${style.emailId_input} ${input_style.content_input}`} id="emailId" type="text" onChange={(e) => setStateValue("emailId", e.target.value)} value={getStateValue("emailId")} placeholder=''></input>
              <label className={`${style.emailId_input_label} ${input_style.content_input_label}`} htmlFor="emailId" aria-hidden="true">이메일 아이디</label>
            </div>
            <div className={style.atSign_wrap}>
              <div className={style.atSign}>@</div>
            </div>
            <div className={style.emailDomain_input_wrap}>
              <input className={`${style.emailDomain_input} ${input_style.content_input}`} id="emailDomain" list='domainList' onChange={(e) => setStateValue("emailDomain", e.target.value)} value={getStateValue("emailDomain")} placeholder=''></input>
              <datalist id="domainList">
                <option value="naver.com">naver.com</option>
                <option value="daum.net">daum.net</option>
                <option value="gmail.com">gmail.com</option>
                <option value="kakao.com">kakao.com</option>
              </datalist>
              {/* <input className={`${style.emailDomain_input} ${input_style.content_input}`} id="emailDomain" type="text" onChange={(e) => changeState("emailDomain", e.target.value)} value={stateValue("emailDomain")} placeholder=''></input> */}
              <label className={`${style.emailDomain_input_label} ${input_style.content_input_label}`} htmlFor="emailDomain" aria-hidden="true">이메일 도메인</label>
            </div>
            <div className={style.sendEmail_button_wrap}>
              {getStateValid("isEmailSend") ? <button className={style.sendEmail_button} onClick={sendEmail}>재전송</button> : <button className={style.sendEmail_button} onClick={sendEmail}>이메일 전송</button>}
            </div>
          </div>
        </div>
        <div className={`${style.certification_input_wrap} ${input_style.input_wrap}`}>
          <div className={style.certification_bottom_input_wrap}>
            <div className={style.certificationNumber_input_wrap}>
              <input className={`${style.certificationNumber_input} ${input_style.content_input}`} id="certificationNumber" type="text" onChange={(e) => setStateValue("certificationNumber", e.target.value)} value={getStateValue("certificationNumber")} placeholder=''></input>
              <label className={`${style.certificationNumber_input_label} ${input_style.content_input_label}`} htmlFor="certificationNumber" aria-hidden="true">인증번호</label>
            </div>
            <div className={style.certificationNumberCheck_button_div}>
              <div className={style.timer_wrap}>
                {getStateValid("isEmailSend") ? formatTime(remainingTime) : ""}
              </div>
              <div className={style.certificationNumberCheck_button_wrap}>
                <button className={style.certificationNumberCheck_button} onClick={checkVerificationCode}>인증하기</button>
              </div>                        
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}
