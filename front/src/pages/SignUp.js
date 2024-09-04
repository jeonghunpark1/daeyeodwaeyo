import {React, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'

import style from "../styles/signup.module.css"
import input_style from "../styles/login_signup_input.module.css"
import SignUpUserInfo from './signup/SignUpUserInfo'
import SignUpCertification from './signup/SignUpCertification'
import SignUpUserProfile from './signup/SignUpUserProfile'

export default function SignUp() {

  const [currentPage, setCurrentPage] = useState(1);

  const showSignupPage = (currentPage) => {
    switch(currentPage) {
      case 1:
        return <SignUpUserInfo  />
      case 2:
        return <SignUpCertification />
      case 3:
        return <SignUpUserProfile />
    }
  }

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
  }

  return (
    <div className={style.signup_page}>
      <div className={style.signup_content}>
        <div className={style.signup_title}>
          <h1>회원가입</h1>
        </div>
        <div className={style.signup_div}>
          { showSignupPage(currentPage) }
        </div>
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
