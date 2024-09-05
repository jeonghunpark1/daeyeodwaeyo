import {React, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'

import style from "../styles/signup/signup.module.css"
import input_style from "../styles/login_signup_input.module.css"
import SignUpUserInfo from './signup/SignUpUserInfo'
import SignUpCertification from './signup/SignUpCertification'
import SignUpUserProfile from './signup/SignUpUserProfile'

export default function SignUp() {

  const [currentPage, setCurrentPage] = useState(1);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber1, setPhoneNumber1] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [phoneNumber3, setPhoneNumber3] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [certificationNumber, setCertificationNumber] = useState();
  // 프로필 사진, 닉네임 추가

  const changeState = (type, value) => {
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
    else if (type === "phoneNumber1") {
      setPhoneNumber1(value);
    }
    else if (type === "phoneNumber2") {
      setPhoneNumber2(value);
    }
    else if (type === "phoneNumber3") {
      setPhoneNumber3(value);
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
  }

  const stateValue = (type) => {
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
    else if (type === "phoneNumber1") {
      return phoneNumber1;
    }
    else if (type === "phoneNumber2") {
      return phoneNumber2
    }
    else if (type === "phoneNumber3") {
      return phoneNumber3
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
  }

  const showSignupPage = (currentPage) => {
    switch(currentPage) {
      case 1:
        return <SignUpUserInfo  changeState={changeState} stateValue={stateValue}/>
      case 2:
        return <SignUpCertification changeState={changeState} stateValue={stateValue}/>
      case 3:
        return <SignUpUserProfile changeState={changeState} stateValue={stateValue}/>
    }
  };

  const buttonByPage = (currentPage) => {
    switch(currentPage) {
      case 1:
        return (
          <div className={style.page_button_div}>
            <button className='next_button'>취소</button>
            <button className='next_button' onClick={() => {setCurrentPage(currentPage+1)}}>다음</button>
          </div>
        )
      case 2:
        return (
          <div className={style.page_button_div}>
            <button className='next_button' onClick={() => {setCurrentPage(currentPage-1)}}>이전</button>
            <button className='next_button' onClick={() => {setCurrentPage(currentPage+1)}}>다음</button>
          </div>
        )
      case 3:
        return (
          <div className={style.page_button_div}>
            <button className='next_button' onClick={() => {setCurrentPage(currentPage-1)}}>이전</button>
            <button className='next_button'>회원가입</button>
          </div>
        )
    }
  };

  

  return (
    <div className={style.signup_page}>
      <div className={style.signup_content}>
        <div className={style.signup_title}>
          <h1>회원가입</h1>
        </div>
        { showSignupPage(currentPage) }
        { buttonByPage(currentPage) }
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
