import React, { useRef, useState } from 'react'
import style from "../../styles/signup/signupUserProfile.module.css"
import input_style from "../../styles/login_signup_input.module.css"
import axios from 'axios';

export default function SignUpUserProfile({ setStateValue, getStateValue }) {

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    uploadImage(file); // 이미지를 선택하면 바로 업로드
  };


  // 수정수정수정수정

  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    axios.post("http://localhost:8080/api/content/tempContent", formData, {
      headers: {
        "Content-Type": "multipart/form-data",

      },
      withCredentials: true // 클라이언트와 서버가 통신할 때 쿠키와 같은 인증 정보 값을 공유하겠다는 설정
    })
    .then((response) => {
      setImageURL(response.data); // 백엔드에서 받은 이미지 URL
      // onProfileImageUpload(response.data.url); // 부모 컴포넌트로 URL 전달
      setStateValue("profileImageURL", response.data);
      
      // 확인용 코드
      // alert(response.data);
    })
    .catch((error) => {
      console.error("이미지 업로드 오류:", error);
    });
  };



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
            <input className={style.profileImage_input} type='file' accept='image/jpg, image/png, image/jpeg' onChange={ (e) => {profileImageChange(e); handleImageChange(e);} } ref={profileImageInput}></input>
          </div>
          <div className={style.profileImage_select_button_wrap}>
            <button className={style.profileImage_select_button} for="previewImage_upload_button" onClick={() => {profileImageInput.current.click();}} >프로필 선택</button>
          </div>
        </div>
        <div className={`${style.nickName_input_wrap}`}>
          <input className={`${style.nickName_input}`} id="nickName" type="text" onChange={(e) => setStateValue("nickName", e.target.value)} value={getStateValue("nickName")} placeholder=''></input>
          <label className={`${style.nickName_input_label}`} htmlFor="nickName" aria-hidden="true">닉네임</label>
        </div>
      </div>    
    </div>
    
  )
}
