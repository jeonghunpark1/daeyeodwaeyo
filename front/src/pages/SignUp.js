import {React, useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import style from "../styles/signup/signup.module.css";
import input_style from "../styles/login_signup_input.module.css";
import SignUpUserInfo from './signup/SignUpUserInfo';
import SignUpCertification from './signup/SignUpCertification';
import SignUpUserProfile from './signup/SignUpUserProfile';

export default function SignUp() {

  const [profileImageURL, setProfileImageURL] = useState(""); // 이미지 URL 저장





  const [currentPage, setCurrentPage] = useState(1);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [certificationNumber, setCertificationNumber] = useState();
  const [profileImage, setProfileImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
  const [nickName, setNickName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const setStateValue = (type, value) => {
    if(type === "id") {
      setId(value);
    }
    else if (type === "password") {
      setPassword(value);
    }
    else if (type === "rePassword") {
      setRePassword(value);
    }
    else if (type === "name") {
      setName(value);
    }
    else if (type === "phoneNumber") {
      // 전화번호 정규식
      const regex = /^[0-9\b -]{0,13}$/;
      if (regex.test(value)) {
        setPhoneNumber(value);
      }
    }
    else if (type === "address") {
      setAddress(value);
    }
    else if (type === "detailAddress") {
      setDetailAddress(value);
    }
    else if (type === "zipCode") {
      setZipCode(value);
    }
    else if (type === "emailId") {
      setEmailId(value);
    }
    else if (type === "emailDomain") {
      setEmailDomain(value);
    }
    else if (type === "certificationNumber") {
      setCertificationNumber(value);
    }
    else if (type === "profileImage") {
      setProfileImage(value);
    }
    else if (type === "profileImageURL") {
      setProfileImageURL(value);
    }
    else if (type === "nickName") {
      setNickName(value);
    }
  }

  const getStateValue = (type) => {
    if(type === "id") {
      return id;
    }
    else if (type === "password") {
      return password;
    }
    else if (type === "rePassword") {
      return rePassword;
    }
    else if (type === "name") {
      return name;
    }
    else if (type === "phoneNumber") {
      return phoneNumber;
    }
    else if (type === "address") {
      return address;
    }
    else if (type === "detailAddress") {
      return detailAddress;
    }
    else if (type === "zipCode") {
      return zipCode;
    }
    else if (type === "emailId") {
      return emailId;
    }
    else if (type === "emailDomain") {
      return emailDomain;
    }
    else if (type === "certificationNumber") {
      return certificationNumber;
    }
    else if (type === "profileImage") {
      return profileImage;
    }
    else if (type === "profileImageURL") {
      return profileImageURL;
    }
    else if (type === "nickName") {
      return nickName;
    }
  }

  // 회원가입 처리 함수
  const handleSignUp = async () => {
    const userData = {
      id,
      password,
      name,
      phoneNumber,
      address: `${address} ${detailAddress} (${zipCode})`,
      email: `${emailId}@${emailDomain}`,
      profileImage: profileImageURL,
      nickName
    };

    // 확인용 코드
    // alert(JSON.stringify(userData));

    try {
      const response = await axios.post('http://localhost:8080/api/users/signup', JSON.stringify(userData), {
        headers: {
          'Content-Type': 'application/json',

        },
        withCredentials: true // 클라이언트와 서버가 통신할 때 쿠키와 같은 인증 정보 값을 공유하겠다는 설정
      }); // 회원가입 API 호출
      if(response && response.data) {
        alert(response.data); // 성공 메시지 출력
        navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
      } else {
        throw new Error("서버로부터 유효한 응답을 받지 못했습니다.");
      }
    } catch (err) {
      if (err.response) {
        // 서버가 응답을 보냈으나 실패한 경우
        setError(`Error: ${err.response.status} - ${err.response.data}`);
      } else if (err.request) {
          // 요청이 보내졌지만 응답을 받지 못한 경우
          setError("서버로부터 응답이 없습니다.");
      } else {
          // 요청을 보내는 중에 발생한 다른 오류
          setError(`요청 중 오류 발생: ${err.message}`);
      }
    }
    
    // 확인용 코드
    // alert(JSON.stringify("에러: ", error));
  }

  const showSignupPage = (currentPage) => {
    switch(currentPage) {
      case 1:
        return <SignUpUserInfo  setStateValue={setStateValue} getStateValue={getStateValue}/>
      case 2:
        return <SignUpCertification setStateValue={setStateValue} getStateValue={getStateValue}/>
      case 3:
        return <SignUpUserProfile setStateValue={setStateValue} getStateValue={getStateValue}/>
    }
  };

  const buttonByPage = (currentPage) => {
    switch(currentPage) {
      case 1:
        return (
          <div className={style.page_button_wrap}>
            <button className='cancel_button'>취소</button>
            <button className='next_button' onClick={() => {setCurrentPage(currentPage+1)}}>다음</button>
          </div>
        )
      case 2:
        return (
          <div className={style.page_button_wrap}>
            <button className='previous_button' onClick={() => {setCurrentPage(currentPage-1)}}>이전</button>
            <button className='next_button' onClick={() => {setCurrentPage(currentPage+1)}}>다음</button>
          </div>
        )
      case 3:
        return (
          <div className={style.page_button_wrap}>
            <button className='previous_button' onClick={() => {setCurrentPage(currentPage-1)}}>이전</button>
            <button className='signup_button' onClick={handleSignUp}>회원가입</button>
          </div>
        )
    }
  };

  const progressBox = (currentPage) => {
    let arr = [];
    for(let i=0; i<currentPage; i++) {
      arr.push(
        <div className={`${style.progressBox_activated} ${style.progressBox}`}></div>
      )
    }
    for(let k=0; k<3-currentPage; k++) {
      arr.push(
        <div className={`${style.progressBox_disabled} ${style.progressBox}`}></div>
      )
    }
    return arr;
  }

  useEffect(() => {
    if (phoneNumber.length === 10) {
      setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
    }
    if (phoneNumber.length === 13) {
      setPhoneNumber(phoneNumber.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
    } 
  }, [phoneNumber]);

  return (
    <div className={style.signup_page}>
      <div className={style.signup_content_wrap}>
        <div className={style.progressBox_wrap}>
          {progressBox(currentPage)}
        </div>
        <div className={style.signup_content}>
          <div className={style.signup_title}>
            <h1>회원가입</h1>
          </div>
          { showSignupPage(currentPage) }
          { buttonByPage(currentPage) }
        </div>
      </div>
      
    </div>
  )
}

// 아이디
// 비밀번호
// 비밀번호 확인

// 이름
// 전화번호
// 주소
//-------------

// 이메일
// 인증번호
//--------------

// 프로필 사진
// 닉네임
