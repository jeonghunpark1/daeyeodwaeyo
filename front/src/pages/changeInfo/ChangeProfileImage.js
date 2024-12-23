import React, { useRef, useState } from 'react'

import style from "../../styles/changeInfo/changeProfileImage.module.css"
import { IoMdAdd } from "react-icons/io";
import axios from 'axios';

import { API_BASE_URL } from '../../utils/constants';

export default function ChangeProfileImage() {

  const [selectedImage, setSelectedImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
  const [profileImage, setProfileImage] = useState("");

  // 파일 업로더
  const profileImageInput = useRef(null);

  // 사진 미리보기
  const profileImageChange = (e) => {
    if(e.target.files[0]) {
      // 미리보기를 위한
      setSelectedImage(e.target.files[0]);
      setProfileImage(e.target.files[0]);
      // setProfileImage(e.target.files[0]);
    } else { //업로드 취소
      setProfileImage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
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

  const changeProfileImage = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("profileImage", profileImage);

      const response = await axios.post(`${API_BASE_URL}/api/users/changeProfileImage`, formData, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log("response: ", response.data);
      if(response && response.data === true) {
        alert("프로필사진이 변경되었습니다.");

        window.location.reload();
      } else {
        alert("프로필사진이 변경되지 않았습니다.");

        window.location.reload();
      }
    } catch (err) {
      alert("서버에 요청을 실패했습니다." + err);
    }
  };

  return (
    <div className={style.changeProfileImage_page}>
      <div className={style.changeProfileImage_title_wrap}>
        <h3 className={style.changeProfileImage_title}>프로필 사진 변경</h3>
      </div>
      <div className={style.changeProfileImage_content_wrap}>
        <div className={style.profileImage_input_wrap}>
          <input className={style.profileImage_input} type='file' accept='image/jpg, image/png, image/jpeg' onChange={ (e) => {profileImageChange(e);} } ref={profileImageInput}></input>
          <img className={style.profileImage} src={selectedImage} alt='선택한 사진'/>         
          <div className={style.add_profileImage_button_wrap}>
            <button className={style.add_profileImage_button} for="previewImage_upload_button" onClick={() => {profileImageInput.current.click();}}>
              <IoMdAdd className={style.add_profileImage_button_icon}/>
            </button>
          </div>
        </div>
        <div className={style.profileImageChange_button_wrap}>
            <button className={`${style.profileImageChange_button} ${profileImage ? style.actived_button : style.disabled_button}`} disabled={profileImage ? false : true} onClick={() => {changeProfileImage()}}>프로필사진 변경</button>
          </div>
      </div>
    </div>
  )
}
