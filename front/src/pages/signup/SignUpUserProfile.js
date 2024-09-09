import React from 'react'
import style from "../../styles/signup/signupUserProfile.module.css"
import input_style from "../../styles/login_signup_input.module.css"

export default function SignUpUserProfile({ changeState, stateValue }) {
  return (
    <div className={style.signup_div}>
      <h1>
        <div>SignUpUserProfile</div>
      </h1>
      <div className={style.input_wrap_div}>
        <div className={`${style.profileImage_wrap}`}>
          <div className={style.profileImage_input_wrap}>
            <img className={style.previewImage} src="https://placehold.co/90x90" />
            <button className={style.previewImage_upload_button} id="previewImage_upload_button" onClick={() => {alert('이미지 선택')}}></button>
            <label className={style.previewImage_upload_label} for="previewImage_upload_button" aria-hidden="true"></label>
          </div>
          <div className={style.previewImage_select_label_wrap}>
            <label className={style.previewImage_select_label} for="previewImage_upload_button">프로필 선택</label>
          </div>
        </div>
        <div className={`${style.nickName_input_wrap}`}>
          <input className={`${style.nickName_input}`} id="nickName" type="text" onChange={(e) => changeState("nickName", e.target.value)} value={stateValue("nickName")} placeholder=''></input>
          <label className={`${style.nickName_input_label}`} for="nickName" aria-hidden="true">닉네임</label>
        </div>
      </div>    
    </div>
    
  )
}
