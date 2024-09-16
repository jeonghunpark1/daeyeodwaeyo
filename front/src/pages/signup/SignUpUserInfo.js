import React from 'react'
import style from "../../styles/signup/signupUserInfo.module.css"
import input_style from "../../styles/login_signup_input.module.css"

export default function SignUpUserInfo({ setStateValue, getStateValue }) {
  return (
    <div className={style.signup_div}>
      <h1>
        SignUpUserInfo
      </h1>
      <div className={style.input_wrap_div}>
        <div className={`${style.id_input_wrap} ${input_style.input_wrap}`}>
          <input className={`${style.id_input} ${input_style.content_input}`} id="id" type="text" onChange={(e) => setStateValue("id", e.target.value)} value={getStateValue("id")} placeholder=''></input>
          <label className={`${style.id_input_label} ${input_style.content_input_label}`} htmlFor="id" aria-hidden="true">아이디</label>
        </div>
        <div className={`${style.password_input_wrap} ${input_style.input_wrap}`}>
          <input className={`${style.password_input} ${input_style.content_input}`} id="password" type="password" onChange={(e) => setStateValue("password", e.target.value)} value={getStateValue("password")} placeholder=''></input>
          <label className={`${style.password_input_label} ${input_style.content_input_label}`} htmlFor="password" aria-hidden="true">비밀번호</label>
        </div>
        <div className={`${style.re_password_input_wrap} ${input_style.input_wrap}`}>
          <input className={`${style.re_password_input} ${input_style.content_input}`} id="rePassword" type="password" onChange={(e) => setStateValue("rePassword", e.target.value)} value={getStateValue("rePassword")} placeholder=''></input>
          <label className={`${style.repassword_input_label} ${input_style.content_input_label}`} htmlFor="rePassword" aria-hidden="true">비밀번호 확인</label>
        </div>
        <div className={`${style.name_input_wrap} ${input_style.input_wrap}`}>
          <input className={`${style.name_input} ${input_style.content_input}`} id="name" type="text" onChange={(e) => setStateValue("name", e.target.value)} value={getStateValue("name")} placeholder=''></input>
          <label className={`${style.name_input_label} ${input_style.content_input_label}`} htmlFor="name" aria-hidden="true">이름</label>
        </div>
        <div className={`${style.phone_input_wrap} ${input_style.input_wrap}`}>
          <input className={`${style.phoneNumber_input} ${input_style.content_input}`} id="phoneNumber" type="text" onChange={(e) => setStateValue("phoneNumber", e.target.value)} value={getStateValue("phoneNumber")} placeholder=''></input>
          <label className={`${style.phoneNumber_input_label} ${input_style.content_input_label}`} htmlFor="phoneNumber" aria-hidden="true">전화번호</label>
        </div>
        <div className={`${style.address_input_wrap} ${input_style.input_wrap}`}>
          <div className={style.address_top_wrap}>
            <div className={style.address_top_input_wrap}>
              <div className={style.address_wrap}>
                <input className={`${style.address_input} ${input_style.content_input}`} id="address" type="text" onChange={(e) => setStateValue("address", e.target.value)} value={getStateValue("address")} placeholder=''></input>
                <label className={`${style.address_input_label} ${input_style.content_input_label}`} htmlFor="address" aria-hidden="true">주소</label>
              </div>
              <div className={style.zipCode_wrap}>
                <input className={`${style.zipCode_input} ${input_style.content_input}`} id="zipCode" type="text" onChange={(e) => setStateValue("zipCode", e.target.value)} value={getStateValue("zipCode")} placeholder=''></input>
                <label className={`${style.zipCode_input_label} ${input_style.content_input_label}`} htmlFor="zipCode" aria-hidden="true">우편번호</label>
              </div>
              <div className={style.address_search_button_wrap}>
                <button className={style.address_search_button}>주소찾기</button>
              </div>
            </div>
          </div>
          <div className={style.address_bottom_wrap}>
            <div className={style.detailAddress_wrap}>
              <input className={`${style.detailAddress_input} ${input_style.content_input}`} id="detailAddress" type="text" onChange={(e) => setStateValue("detailAddress", e.target.value)} value={getStateValue("detailAddress")} placeholder=''></input>
              <label className={`${style.detailAddress_input_label} ${input_style.content_input_label}`} htmlFor="detailAddress" aria-hidden="true">상세주소</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
