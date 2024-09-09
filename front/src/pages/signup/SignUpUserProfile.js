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
            <img className={style.previewImage} src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
          </div>
          <div className={style.previewImage_select_label_wrap}>
            <button className={style.previewImage_select_label} for="previewImage_upload_button" onClick={() => {alert('이미지 선택')}} >프로필 선택</button>
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
