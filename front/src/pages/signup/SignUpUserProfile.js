import React, { useRef, useState } from 'react'
import style from "../../styles/signup/signupUserProfile.module.css"
import input_style from "../../styles/login_signup_input.module.css"
import axios from 'axios';

export default function SignUpUserProfile({ setStateValue, getStateValue, setStateValid, getStateValid }) {

  const [selectedImage, setSelectedImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
  // const [imageURL, setImageURL] = useState("");

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   setSelectedImage(file);
  //   // uploadImage(file); // 이미지를 선택하면 바로 업로드
  // };


  // // 수정수정수정수정

  // const uploadImage = (file) => {
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   axios.post("http://localhost:8080/api/content/tempContent", formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",

  //     },
  //     withCredentials: true // 클라이언트와 서버가 통신할 때 쿠키와 같은 인증 정보 값을 공유하겠다는 설정
  //   })
  //   .then((response) => {
  //     setImageURL(response.data); // 백엔드에서 받은 이미지 URL
  //     // onProfileImageUpload(response.data.url); // 부모 컴포넌트로 URL 전달
  //     setStateValue("profileImageURL", response.data);
      
  //     // 확인용 코드
  //     // alert(response.data);
  //   })
  //   .catch((error) => {
  //     console.error("이미지 업로드 오류:", error);
  //   });
  // };



  // 파일 업로더
  const profileImageInput = useRef(null);

  // 사진 미리보기
  const profileImageChange = (e) => {
    if(e.target.files[0]) {
      // 미리보기를 위한
      setSelectedImage(e.target.files[0]);
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
        setSelectedImage(reader.result)
        // setProfileImage(reader.result);
      }
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  const checkMessage = (isCorrect) => {
    // 검증 성공했을 때 나오는 메시지
    if (isCorrect == true) {
      if (getStateValid("nickNameOverlap") == true) {
        if (getStateValue("nickName") == getStateValue("availableNickName")) {
          return "사용 가능한 닉네임입니다.";
        }
        else {
          return "다시 중복확인을 해주세요."
        }
      }
      else if (getStateValid("nickNameOverlap") == false) {
        if (getStateValue("nickName") == getStateValue("availableNickName")) {
          return "이미 존재하는 닉네임입니다.";
        }
        else {
          return "닉네임 중복확인을 해주세요.";
        }
      }
    }
    // 검증 실패했을 때 나오는 메시지
    else if (isCorrect == false) {
      if (getStateValid("nickNameOverlap") == true) {
        return <p>앞/뒤 공백 없이 한 글자 이상 작성하고 다시 중복확인을 <br/>해주세요.</p>;
      }
      else if (getStateValid("nickNameOverlap") == false) {
        return "앞/뒤 공백 없이 한 글자 이상 작성해주세요.";
      }
    }
    else if (isCorrect == "overlap") {
      return "중복된 닉네임입니다.";
    }
    else if (isCorrect == "default") {
      return "default";
    }
  }

  const checkWrap = (isCorrect) => {
    if (getStateValid("nickNameOverlap") == false) {
      if (isCorrect == true) {
        return (
          <div className={style.wrong_message_wrap}>
            {checkMessage(isCorrect)}
          </div>
        );
      } 
      else if (isCorrect == false) {
        return (
          <div className={style.wrong_message_wrap}>
            {checkMessage(isCorrect)}
          </div>
        );
      }
      else if (isCorrect == "default") {
        return (
          <div className={style.default_message_wrap}>
            {checkMessage(isCorrect)}
          </div>
        );
      }
    } 
    else if (getStateValid("nickNameOverlap") == true) {
      if (isCorrect == true) {
        if (getStateValue("nickName") == getStateValue("availableId")) {
          return (
            <div className={style.correct_message_wrap}>
              {checkMessage(isCorrect)}
            </div>
          );
        }
        else {
          return (
            <div className={style.wrong_message_wrap}>
              {checkMessage(isCorrect)}
            </div>
          );
        }
      }
      else if (isCorrect == false) {
        return (
          <div className={style.wrong_message_wrap}>
            {checkMessage(isCorrect)}
          </div>
        );
      }
      else if (isCorrect == "default") {
        return (
          <div className={style.default_message_wrap}>
            {checkMessage(isCorrect)}
          </div>
        );
      }
    }
  }

  // const checkNickNameOverlap = () => {
  //   setStateValid("nickNameOverlap", true);
  // }

  const checkNickNameDuplicate = async () => {
    const userNickName = getStateValue("nickName");
    try {
      const response = await axios.get('/api/users/nickNameDuplicate', {
        params: {
          nickName: userNickName
        }
      },
      {withCredentials: true});
      setStateValid("nickNameOverlap", !response.data);
      console.log("nickNameOverlap reponse: ", getStateValid("nickNameOverlap"));
      console.log("nickName: ", getStateValue("nickName"));
      setStateValue("availableNickName", userNickName);
      console.log("availableNickName: ", getStateValue("availableNickName"));
    } catch (error) {
      console.error("Error checking nickName: ", error);
    }
  }

  return (
    <div className={style.signup_div}>
      <h1>
        <div>SignUpUserProfile</div>
      </h1>
      <div className={style.input_wrap_div}>
        <div className={`${style.profileImage_wrap}`}>
          <div className={style.profileImage_input_wrap}>
            <img className={style.profileImage} src={selectedImage} />
            <input className={style.profileImage_input} type='file' accept='image/jpg, image/png, image/jpeg' onChange={ (e) => {profileImageChange(e);} } ref={profileImageInput}></input>
          </div>
          <div className={style.profileImage_select_button_wrap}>
            <button className={style.profileImage_select_button} for="previewImage_upload_button" onClick={() => {profileImageInput.current.click();}} >프로필 선택</button>
          </div>
        </div>
        <div className={`${style.nickName_box} ${input_style.input_warp}`}>
          <div className={`${style.nickName_input_wrap}`}>
            <input className={`${style.nickName_input} ${input_style.content_input}`} id="nickName" type="text" onChange={(e) => setStateValue("nickName", e.target.value)} value={getStateValue("nickName")} placeholder=''></input>
            <label className={`${style.nickName_input_label} ${input_style.content_input_label}`} htmlFor="nickName" aria-hidden="true">닉네임</label>
          </div>
          <div className={style.nickName_check_wrap}>
            {getStateValue("nickName") ? checkWrap(getStateValid("nickName")) : checkWrap("default")}
            <button className={`${style.nickName_check_button} ${getStateValid("nickName") ? style.actived_button : style.disabled_button}`} disabled={getStateValid("nickName") ? false : true} onClick={() => {checkNickNameDuplicate()}}>중복확인</button>
          </div>
        </div>
      </div>    
    </div>
    
  )
}
