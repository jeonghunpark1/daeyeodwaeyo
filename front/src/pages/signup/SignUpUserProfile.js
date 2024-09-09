import React, { useRef } from 'react'
import style from "../../styles/signup/signupUserProfile.module.css"
import input_style from "../../styles/login_signup_input.module.css"

export default function SignUpUserProfile({ setStateValue, getStateValue }) {

  // 파일 업로더
  const profileImageInput = useRef(null);

  // 사진 미리보기
  const profileImageChange = (e) => {
    if(e.target.files[0]) {
      setStateValue("profileImage", e.target.files[0]);
      // setProfileImage(e.target.files[0]);
    } else { //업로드 취소
      setStateValue("profileImage", "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
      // setProfileImage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
      return
    }
    // 화면에 프로필 사진 표시
    const reader = new FileReader();
    reader.onload = () => {
      if(reader.readyState === 2) {
        setStateValue("profileImage", reader.result);
        // setProfileImage(reader.result);
      }
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  return (
    <div className={style.signup_div}>
      <h1>
        <div>SignUpUserProfile</div>
      </h1>
      <div className={style.input_wrap_div}>
        <div className={`${style.profileImage_wrap}`}>
          <div className={style.profileImage_input_wrap}>
            <img className={style.profileImage} src={getStateValue("profileImage")} />
            <input className={style.profileImage_input} type='file' accept='image/jpg, image/png, image/jpeg' onChange={profileImageChange} ref={profileImageInput}></input>
          </div>
          <div className={style.profileImage_select_button_wrap}>
            <button className={style.profileImage_select_button} for="previewImage_upload_button" onClick={() => {profileImageInput.current.click(); alert(getStateValue("profileImage"))}} >프로필 선택</button>
          </div>
        </div>
        <div className={`${style.nickName_input_wrap}`}>
          <input className={`${style.nickName_input}`} id="nickName" type="text" onChange={(e) => setStateValue("nickName", e.target.value)} value={getStateValue("nickName")} placeholder=''></input>
          <label className={`${style.nickName_input_label}`} for="nickName" aria-hidden="true">닉네임</label>
        </div>
      </div>    
    </div>
    
  )
}
