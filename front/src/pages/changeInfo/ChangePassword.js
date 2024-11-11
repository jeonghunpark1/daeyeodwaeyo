import React, { useEffect, useState } from 'react'

import style from "../../styles/changeInfo/changePassword.module.css";
import axios from 'axios';

export default function ChangePassword() {

  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [rePasswordValid, setRePasswordValid] = useState(false);

  const checkMessage = (type, isCorrect) => {
    // 검증 성공했을 때 나오는 메시지
    if (isCorrect == true) {
      if (type == "password") {
        return "비밀번호 사용이 가능합니다.";
      }
      else if (type == "rePassword") {
        return "비밀번호가 일치합니다.";
      }
    }
    // 검증 실패했을 때 나오는 메시지
    else if (isCorrect == false) {
      if (type == "password") {
        return <p>영문, 숫자, 특수문자 포함 <br/>8글자 이상 작성해주세요.</p>;
      }
      else if (type == "rePassword") {
        return "비밀번호가 일치하지 않습니다.";
      }
    }
    // 처음 보이는 메시지
    else if (isCorrect == "default") {
      if (type == "password") {
        return <p>영문, 숫자, 특수문자 포함 <br/>8글자 이상 작성해주세요.</p>;
      }
      else if (type == "rePassword") {
        return ;
      }
    }
  }

  const checkWrap = (type, isCorrect) => {
    if (isCorrect == true) {
      return (
        <div className={style.correct_message_wrap}>
          {checkMessage(type, isCorrect)}
        </div>
      );
    }
    else if (isCorrect == false) {
      return (
        <div className={style.wrong_message_wrap}>
          {checkMessage(type, isCorrect)}
        </div>
      );
    }
    else if (isCorrect == "default") {
      return (
        <div className={style.default_message_wrap}>
          {checkMessage(type, isCorrect)}
        </div>
      );
    }
  }

  const setStateValid = (type, value) => {
    if (type === "password") {
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // 영문, 숫자, 특수문자 포함 8글자 이상
      const valid = passwordRegex.test(value);
      // console.log("password valid: ", valid);
      setPasswordValid(valid);
    }
    else if (type === "rePassword") {
      if(passwordValid) {
        const valid = password == value;
        setRePasswordValid(valid);
        // console.log("rePassword valid: ", valid);
      }
      else {
        setRePasswordValid(false);
      }
      
    }
  }

  useEffect(() => {
    setStateValid("password", password);
    setStateValid("rePassword", rePassword);
  }, [password, rePassword]);

  const changePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post('http://localhost:8080/api/users/changePassword', {
        password
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log("response: ", response.data);
      if(response && response.data === true) {
          alert("비밀번호가 변경되었습니다.");
          
          window.location.reload();
      } else {
        alert("비밀번호가 변경되지 않았습니다.");

        window.location.reload();
      }
    } catch (err) {
      alert("서버에 요청을 실패했습니다." + err);
    }
  }

  return (
    <div className={style.changePassword_page}>
      <div className={style.changePassword_title_wrap}>
        <h3 className={style.changePassword_title}>비밀번호 변경</h3>
      </div>
      <div className={style.changePassword_content_wrap}>
        <div className={`${style.password_box} ${style.input_wrap}`}>
          <div className={`${style.password_input_wrap}`}>
            <input className={`${style.password_input} ${style.content_input}`} id="password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder=''></input>
            <label className={`${style.password_input_label} ${style.content_input_label}`} htmlFor="password" aria-hidden="true">비밀번호</label>
          </div>
          <div className={style.password_check_wrap}>
            {password ? checkWrap("password", passwordValid) : checkWrap("password", "default")}
          </div>
        </div>
        <div className={`${style.re_password_box} ${style.input_wrap}`}>
          <div className={`${style.re_password_input_wrap}`}>
            <input className={`${style.re_password_input} ${style.content_input}`} id="rePassword" type="password" onChange={(e) => setRePassword(e.target.value)} value={rePassword} placeholder=''></input>
            <label className={`${style.re_password_input_label} ${style.content_input_label}`} htmlFor="rePassword" aria-hidden="true">비밀번호 확인</label>
          </div>
          <div className={style.re_password_check_wrap}>
            {rePassword ? checkWrap("rePassword", rePasswordValid) : checkWrap("rePassword", "default")}
          </div> 
        </div>
        <div className={style.passwordChange_button_wrap}>
          <button className={`${style.passwordChange_button} ${rePasswordValid ? style.actived_button : style.disabled_button}`} disabled={rePasswordValid ? false : true} onClick={() => {changePassword()}}>비밀번호 변경</button>
        </div>
      </div>
    </div>
  )
}
