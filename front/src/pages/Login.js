import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import style from "../styles/login.module.css"

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  // const [loginCheck, setLoginCheck] = useState(false); {/*로그인 상태 체크*/}
  
  const navigate = useNavigate();

  const handleIdChange = (e) => {
    setId(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  // const handleLogin = async (event) => {
  //   {/* 로그인 처리 로직 */}
  //   event.preventDefault();
  //   await new Promise((r) => setTimeout(r, 1000));

  //   const response = await fetch(
  //     "로그인 서버 주소",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: email,
  //         password: password,
  //       }),
  //     }
  //   );
  //   const result = await response.json();

  //   if (response.status === 200) {
  //     setLoginCheck(false);
      
  //   }
  // }
  return (
    <div className={style.login_page}>
      <div className={style.login_content}>
        <div className={style.login_title}>
          <h1>로그인</h1>
        </div>
        <div className={style.login_div}>
          <div className={style.input_wrap}>
            <input type='text' value={id} onChange={handleIdChange}></input>
            <input type='password' value={password} onChange={handlePasswordChange}></input>
          </div>
          <button className={style.login_button}>
            로그인
          </button>
          <div className={style.link_wrap}>
            <Link className={style.find_id} to={'/'}>아이디 찾기</Link>
            <Link className={style.find_password} to={'/'}>비밀번호 찾기</Link>
            <Link className={style.signup} to={'/singup'}>회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  )
}