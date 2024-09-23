import React from 'react'
import axios from 'axios';

import style from "../../styles/signup/signupCertification.module.css"
import input_style from "../../styles/login_signup_input.module.css"

export default function SignUpCertification({ setStateValue, getStateValue }) {

  const email = getStateValue("emailId") + "@" + getStateValue("emailDomain");

  // 입력한 이메일로 인증 코드를 정송하는 함수
  const sendEmail = async () => {
    console.log("email", {email});
    try {
      const response = await axios.post('http://localhost:8080/api/email/sendCode', {email}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true // 클라이언트와 서버가 통신할 때 쿠키와 같은 인증 정보 값을 공유하겠다는 설정
      });
      if(response && response.data) {
        alert(response.data) // 성공 메시지 출력
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
        alert(response.data)
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
        <div>SignUpCertification</div>
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
              <button className={style.sendEmail_button} onClick={sendEmail}>이메일 전송</button>
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
              <button className={style.certificationNumberCheck_button} onClick={checkVerificationCode}>인증하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}
