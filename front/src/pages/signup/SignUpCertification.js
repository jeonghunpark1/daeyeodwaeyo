import React from 'react'
import style from "../../styles/signup/signupCertification.module.css"
import input_style from "../../styles/login_signup_input.module.css"

export default function SignUpCertification({ changeState, stateValue }) {
  return (
    <div className={style.signup_div}>
      <h1>
        <div>SignUpCertification</div>
      </h1>
      <div className={style.input_wrap_div}>
        <div className={`${style.email_input_wrap} ${input_style.input_wrap}`}>
          <div className={style.email_top_input_wrap}>
            <div className={style.emailId_input_wrap}>
              <input className={`${style.emailId_input} ${input_style.content_input}`} id="emailId" type="text" onChange={(e) => changeState("emailId", e.target.value)} value={stateValue("emailId")} placeholder=''></input>
              <label className={`${style.emailId_input_label} ${input_style.content_input_label}`} for="emailId" aria-hidden="true">이메일 아이디</label>
            </div>
            <div className={style.atSign_wrap}>
              <div className={style.atSign}>@</div>
            </div>
            <div className={style.emailDomain_input_wrap}>
              <input className={`${style.emailDomain_input} ${input_style.content_input}`} id="emailDomain" list='domainList' onChange={(e) => changeState("emailDomain", e.target.value)} value={stateValue("emailDomain")} placeholder=''></input>
              <datalist id="domainList">
                  <option value="naver.com">naver.com</option>
                  <option value="daum.net">daum.net</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="kakao.com">kakao.com</option>
                </datalist>
              {/* <input className={`${style.emailDomain_input} ${input_style.content_input}`} id="emailDomain" type="text" onChange={(e) => changeState("emailDomain", e.target.value)} value={stateValue("emailDomain")} placeholder=''></input> */}
              <label className={`${style.emailDomain_input_label} ${input_style.content_input_label}`} for="emailDomain" aria-hidden="true">이메일 도메인</label>
            </div>
            <div className={style.sendEmail_button_wrap}>
              <button className={style.sendEmail_button}>이메일 전송</button>
            </div>
          </div>
        </div>
        <div className={`${style.certification_input_wrap} ${input_style.input_wrap}`}>
          <div className={style.certification_bottom_input_wrap}>
            <div className={style.certificationNumber_input_wrap}>
              <input className={`${style.certificationNumber_input} ${input_style.content_input}`} id="certificationNumber" type="text" onChange={(e) => changeState("certificationNumber", e.target.value)} value={stateValue("certificationNumber")} placeholder=''></input>
              <label className={`${style.certificationNumber_input_label} ${input_style.content_input_label}`} for="certificationNumber" aria-hidden="true">인증번호</label>
            </div>
            <div className={style.certificationNumberCheck_button_div}>
              <button className={style.certificationNumberCheck_button}>인증하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}
