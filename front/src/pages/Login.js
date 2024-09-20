import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import style from "../styles/login.module.css"
import input_style from "../styles/login_signup_input.module.css"
import axios from 'axios';

export default function Login({ setterIsLogin }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleIdChange = (e) => {
    setId(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault();

    try{
      const response = await axios.post('http://localhost:8080/api/users/login', {
        id,
        password
        },
        {withCredentials: true}
      );
      if(response && response.data) {
        // JWT 토큰을 로컬 스토리지에 저장
        // const token = response.data;
        // alert("response.data: " + response.data);
        // alert("token:", response.data);
        localStorage.setItem('token', response.data);
        setterIsLogin(true);
        // 로그인 성공 시 메인 페이지로 이동
        navigate('/main');
      } else {
        alert("서버로부터 유효한 응답을 받지 못했습니다.");
        throw new Error("서버로부터 유효한 응답을 받지 못했습니다.");
      }

      } catch(err) {
        setError('로그인 실패: 아이디나 비밀번호를 확인해주세요');
        alert("error", {error})
      }
  };

  return (
    <div className={style.login_page}>
      <div className={style.login_content}>
        <div className={style.login_title}>
          <h1>로그인</h1>
        </div>
        <div className={style.login_div}>
          <form onSubmit={handleLogin} className={`${style.input_wrap_div} ${input_style.input_wrap_div}`}>
            <div className={`${style.id_input_wrap} ${input_style.input_wrap}`}>
              <input className={`${style.id_input} ${input_style.content_input}`} id="id" type='text' value={id} onChange={handleIdChange} placeholder=''></input>
              <label className={`${style.id_input_label} ${input_style.content_input_label}`} htmlFor="id" aria-hidden="true">아이디</label>
            </div>
            <div className={`${style.password_input_wrap} ${input_style.input_wrap}`}>
              <input className={`${style.password_input} ${input_style.content_input}`} id="password" type='password' value={password} onChange={handlePasswordChange} placeholder=''></input>
              <label className={`${style.password_input_label} ${input_style.content_input_label}`} htmlFor="password" aria-hidden="true">비밀번호</label>
            </div>
            <button className={style.login_button}>
              로그인
            </button>
          </form>
          {error && <p className={style.error_message}>{error}</p>}
          
          <div className={style.link_wrap}>
            <Link className={style.find_id} to={'/'}>아이디 찾기</Link>
            <Link className={style.find_password} to={'/'}>비밀번호 찾기</Link>
            <Link className={style.signup} to={'/signup'}>회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  )
}