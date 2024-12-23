import React, { useState } from 'react'

import style from "../../styles/changeInfo/checkPassword.module.css";
import axios from 'axios';

import { API_BASE_URL } from '../../utils/constants';

export default function CheckPassword({ setState, getState }) {

  const [password, setPassword] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const checkPassword = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(`${API_BASE_URL}/api/users/checkPassword`, {
        password
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log("response: ", response.data)
      if(response && response.data === true) {

          alert("비밀번호가 일치합니다.");
          setState("currentPage", getState("page"));

      } else {
        console.log("비밀번호가 일치하지 않습니다.")
        alert("비밀번호가 일치하지 않습니다.");
        setPassword("");
      }
    } catch (err) {
      alert("서버에 요청을 실패했습니다." + err);
    }
  }

  return (
    <div className={style.checkPassword_page}>
      <div className={style.checkPassword_title_wrap}>
        <h3 className={style.checkPassword_title}>현재 비밀번호 확인</h3>
      </div>
      <div className={style.checkPassword_content_wrap}>
        <div className={`${style.password_input_wrap} ${style.input_wrap}`}>
          <input className={`${style.password_input} ${style.content_input}`} id="password" type='password' value={password} onChange={handlePasswordChange} placeholder='' onKeyDown={(e) => {if (e.key === "Enter") {checkPassword();}}}></input>
          <label className={`${style.password_input_label} ${style.content_input_label}`} htmlFor="password" aria-hidden="true">비밀번호</label>
        </div>
        <div className={style.passwordCheck_button_wrap}>
          <button className={style.passwordCheck_button} onClick={() => {checkPassword()}}>확인</button>
        </div>
      </div>
    </div>
  )
}
