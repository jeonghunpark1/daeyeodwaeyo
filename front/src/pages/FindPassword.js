import React, { useRef, useState, useEffect } from 'react'
import style from "../styles/findPassword.module.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../utils/constants';

export default function FindPassword() {

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [certificationNumber, setCertificationNumber] = useState("");

  const [isEmailSend, setIsEmailSend] = useState(false);
  const [certificationNumberValid, setCertificationNumberValid] = useState(false);

  const [isCheckCertification, setIsCheckCertification] = useState(false);
  
  const navigate = useNavigate();

  // 타이머 시간 3분
  const initialTime = 180;
    
  // 남은 시간 관리
  const [remainingTime, setRemainingTime] = useState(0);

  const certificationNumberRef = useRef(certificationNumber);

  useEffect(() => {
    certificationNumberRef.current = setCertificationNumberValid;
  }, [certificationNumberValid]);


  useEffect(() => {
    if (remainingTime > 0 && !certificationNumberValid) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      clearInterval();
    }
  }, [remainingTime, certificationNumberValid]);

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
    const email = emailId + "@" + emailDomain;
    const type = "password";
    console.log("email", {email});
    console.log("isEmailSend: ", isEmailSend);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/email/sendCode`, 
        { type, email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true // 클라이언트와 서버가 통신할 때 쿠키와 같은 인증 정보 값을 공유하겠다는 설정
        }
      );
      console.log("response 전체1: ", response);
      if(response && response.data) {
        console.log("response 전체2: ", response);
        alert(response.data); // 성공 메시지 출력
        setIsEmailSend(true);
        // alert("isEmailSend: ", isEmailSend);
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
    const code = certificationNumber;
    try {
      const response = await axios.post(`${API_BASE_URL}/api/email/checkCode`, {code}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      if(response && response.data) {
        alert(response.data);
        setCertificationNumberValid(true);
      } else {
        throw new Error("서버로부터 유효한 응답을 받지 못했습니다.");
      }
    } catch (err) {
      alert("인증코드 불일치");
    }
  }

  const handlecancel = () => {
    window.open('','_self').close(); 
  }

  const findPassword = async () => {
    const fullEmail = `${emailId}@${emailDomain}`;
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/findPassword`, {
        name,
        id,
        email: fullEmail
      });
      // alert("찾은 아이디: " + response.data);
      // 결과 페이지로 이동하면서 데이터를 넘겨줌
      navigate("/findPasswordResult", { state: { inputName: name, tempPassword: response.data } });
    } catch (error) {
      alert("비밀번호 찾기 실패");
    }
  }

  return (
    <div className={style.findPassword_page}>
      <div className={style.findPasswrod_title_wrap}>
        <h2 className={style.findPassword_title}>비밀번호 찾기</h2>
      </div>
      <div className={style.findPassword_content_wrap}>
        <div className={style.name_input_wrap}>
          <label className={style.name_label} htmlFor="name">이름</label>
          <input className={style.name_input} id="name" type="text" onChange={(e) => setName(e.target.value)} value={name}></input>
        </div>
        <div className={style.id_input_wrap}>
          <label className={style.id_label} htmlFor="id">아이디</label>
          <input className={style.id_input} id="id" type="text" onChange={(e) => setId(e.target.value)} value={id}></input>
        </div>
        <div className={style.email_wrap}>
          <label className={style.email_label} htmlFor="emailId">이메일</label>
          <div className={style.email_input_wrap}>
            <div className={style.emailId_input_wrap}>
              <input className={style.emailId_input} id="emailId" type="text" onChange={(e) => setEmailId(e.target.value)} value={emailId} placeholder=''></input>
              {/* <label className={`${style.emailId_input_label} ${style.content_input_label}`} htmlFor="emailId" aria-hidden="true">이메일 아이디</label> */}
            </div>
            <div className={style.atSign_wrap}>
              <div className={style.atSign}>@</div>
            </div>
            <div className={style.emailDomain_input_wrap}>
              <input className={style.emailDomain_input} id="emailDomain" list='domainList' onChange={(e) => setEmailDomain(e.target.value)} value={emailDomain} placeholder=''></input>
              <datalist id="domainList">
                  <option value="naver.com">naver.com</option>
                  <option value="daum.net">daum.net</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="kakao.com">kakao.com</option>
                </datalist>
              {/* <input className={`${style.emailDomain_input} ${input_style.content_input}`} id="emailDomain" type="text" onChange={(e) => changeState("emailDomain", e.target.value)} value={stateValue("emailDomain")} placeholder=''></input> */}
              {/* <label className={`${style.emailDomain_input_label} ${style.content_input_label}`} htmlFor="emailDomain" aria-hidden="true">이메일 도메인</label> */}
            </div>
            <div className={style.sendEmail_button_wrap}>
              {isEmailSend ? <button className={`${style.sendEmail_button} ${style.button}`} onClick={sendEmail}>재전송</button> : <button className={`${style.sendEmail_button} ${style.button}`} onClick={sendEmail}>이메일 전송</button>}
            </div>
          </div>
        </div>
        <div className={style.certification_input_wrap}>
        <label className={style.certificationNumber_input_label} htmlFor="certificationNumber" aria-hidden="true">인증번호</label>
          <div className={style.certification_bottom_input_wrap}>
            <div className={style.certificationNumber_input_wrap}>
              <input className={style.certificationNumber_input} id="certificationNumber" type="text" onChange={(e) => setCertificationNumber(e.target.value)} value={certificationNumber} placeholder=''></input>
            </div>
            <div className={style.certificationNumberCheck_button_div}>
              <div className={style.timer_wrap}>
                {{isEmailSend} ? formatTime(remainingTime) : "타이머타이머타이머"}
              </div>
              <div className={style.certificationNumberCheck_button_wrap}>
                <button className={`${style.certificationNumberCheck_button} ${style.button}`} onClick={checkVerificationCode}>인증하기</button>
              </div>                        
            </div>
          </div>
        </div>
      </div>
      <div className={style.findId_bottom_button_wrap}>
        <button className={`${style.cancel_button} ${style.button}`} onClick={() => {handlecancel()}}>취소</button>
        <button className={`${style.find_button} ${certificationNumberValid ? style.actived_button : style.disabled_button}`} disabled={certificationNumberValid ? false : true} onClick={() => {findPassword()}}>확인</button>
      </div>
    </div>
  )
}
