import React from 'react'
import style from "../../styles/signup/signupUserInfo.module.css"
import input_style from "../../styles/login_signup_input.module.css"

export default function SignUpUserInfo({ changeState, stateValue }) {
  return (
    <div className={style.signup_div}>
      <h1>
        SignUpUserInfo
      </h1>
      <div className={style.input_wrap_div}>
        <div className={`${style.id_input_wrap} ${input_style.input_wrap}`}>
          <input className={`${style.id_input} ${input_style.content_input}`} id="id" type="text" onChange={(e) => changeState("id", e.target.value)} value={stateValue("id")} placeholder=''></input>
          <label className={`${style.id_input_label} ${input_style.content_input_label}`} for="id" aria-hidden="true">아이디</label>
        </div>
        <div className={`${style.password_input_wrap} ${input_style.input_wrap}`}>
          <input className={`${style.password_input} ${input_style.content_input}`} id="password" type="password" onChange={(e) => changeState("password", e.target.value)} value={stateValue("password")} placeholder=''></input>
          <label className={`${style.password_input_label} ${input_style.content_input_label}`} for="password" aria-hidden="true">비밀번호</label>
        </div>
        <div className={`${style.re_password_input_wrap} ${input_style.input_wrap}`}>
          <input className={`${style.re_password_input} ${input_style.content_input}`} id="rePassword" type="password" onChange={(e) => changeState("rePassword", e.target.value)} value={stateValue("rePassword")} placeholder=''></input>
          <label className={`${style.repassword_input_label} ${input_style.content_input_label}`} for="rePassword" aria-hidden="true">비밀번호 확인</label>
        </div>
        <div className={`${style.name_input_wrap} ${input_style.input_wrap}`}>
          <input className={`${style.name_input} ${input_style.content_input}`} id="name" type="text" onChange={(e) => changeState("name", e.target.value)} value={stateValue("name")} placeholder=''></input>
          <label className={`${style.name_input_label} ${input_style.content_input_label}`} for="name" aria-hidden="true">이름</label>
        </div>
        <div className={`${style.phone_input_wrap} ${input_style.input_wrap}`}>
          <input className={`${style.phoneNumber_input} ${input_style.content_input}`} id="phoneNumber" type="text" onChange={(e) => changeState("phoneNumber", e.target.value)} value={stateValue("phoneNumber")} placeholder=''></input>
          <label className={`${style.phoneNumber_input_label} ${input_style.content_input_label}`} for="phoneNumber" aria-hidden="true">전화번호</label>
        </div>
        <div className={`${style.address_input_wrap} ${input_style.input_wrap}`}>
          <div className={style.address_top_wrap}>
            <div className={style.address_wrap}>
              <input className={`${style.address_input} ${input_style.content_input}`} id="address" type="text" onChange={(e) => changeState("address", e.target.value)} value={stateValue("address")} placeholder=''></input>
              <label className={`${style.address_input_label} ${input_style.content_input_label}`} for="address" aria-hidden="true">주소</label>
            </div>
            <div className={style.zipCode_wrap}>
              <input className={`${style.zipCode_input} ${input_style.content_input}`} id="zipCode" type="text" onChange={(e) => changeState("zipCode", e.target.value)} value={stateValue("zipCode")} placeholder=''></input>
              <label className={`${style.zipCode_input_label} ${input_style.content_input_label}`} for="zipCode" aria-hidden="true">우편번호</label>
            </div>
          </div>
          <div className={style.address_bottom_wrap}>
            <div className={style.detailAddress_wrap}>
              <input className={`${style.detailAddress_input} ${input_style.content_input}`} id="detailAddress" type="text" onChange={(e) => changeState("detailAddress", e.target.value)} value={stateValue("detailAddress")} placeholder=''></input>
              <label className={`${style.detailAddress_input_label} ${input_style.content_input_label}`} for="detailAddress" aria-hidden="true">상세주소</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
