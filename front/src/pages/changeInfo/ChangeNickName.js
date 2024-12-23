import React, { useEffect, useState } from 'react'

import style from "../../styles/changeInfo/changeNickName.module.css";
import axios from 'axios';

import { API_BASE_URL } from '../../utils/constants';

export default function ChangeNickName() {

  const [nickName, setNickName] = useState("");
  const [availableNickName, setAvailableNickName] = useState("");
  const [nickNameOverlap, setNickNameOverlap] = useState(false);
  const [nickNameValid, setNickNameValid] = useState(false);

  useEffect(() => {
    const nickNameRegex = /^[^\s](\S*(\s\S+)*)?$/; // 한 글자 이상 / 앞 뒤에는 공백이 불가능하고, 문자 사이에는 공백을 허용
    const valid = nickNameRegex.test(nickName);
    console.log("nickName valid: ", valid);
    setNickNameValid(valid);
  }, [nickName])

  const checkMessage = (isCorrect) => {
    // 검증 성공했을 때 나오는 메시지
    if (isCorrect == true) {
      if (nickNameOverlap == true) {
        if (nickName == availableNickName) {
          return "사용 가능한 닉네임입니다.";
        }
        else {
          return "다시 중복확인을 해주세요."
        }
      }
      else if (nickNameOverlap == false) {
        if (nickName == availableNickName) {
          return "이미 존재하는 닉네임입니다.";
        }
        else {
          return "닉네임 중복확인을 해주세요.";
        }
      }
    }
    // 검증 실패했을 때 나오는 메시지
    else if (isCorrect == false) {
      if (nickNameOverlap == true) {
        return <p>앞/뒤 공백 없이 한 글자 이상 작성하고 다시 중복확인을 <br/>해주세요.</p>;
      }
      else if (nickNameOverlap == false) {
        return "앞/뒤 공백 없이 한 글자 이상 작성해주세요.";
      }
    }
    else if (isCorrect == "overlap") {
      return "중복된 닉네임입니다.";
    }
    else if (isCorrect == "default") {
      return "";
    }
  }

  const checkWrap = (isCorrect) => {
    if (nickNameOverlap == false) {
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
    else if (nickNameOverlap == true) {
      if (isCorrect == true) {
        if (nickName == availableNickName) {
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

  // 닉네임 중복 확인 요청
  const checkNickNameDuplicate = async () => {
    const userNickName = nickName;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/nickNameDuplicate`, {
        params: {
          nickName: userNickName
        }
      },
      {withCredentials: true});
      setNickNameOverlap(!response.data);
      console.log("nickNameOverlap reponse: ", nickNameOverlap);
      console.log("nickName: ", nickName);
      setAvailableNickName(userNickName);
      console.log("availableNickName: ", availableNickName);
    } catch (error) {
      console.error("Error checking nickName: ", error);
    }
  }

  // 닉네임 변경 요청
  const changeNickName = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_BASE_URL}/api/users/changeNickName`, {
        nickName: availableNickName
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log("response: ", response.data);
      if(response && response.data === true) {
        alert("닉네임이 변경되었습니다.");

        window.location.reload();
      } else {
        alert("닉네임이 변경되지 않았습니다.");

        window.location.reload();
      }
    } catch (err) {
      alert("서버에 요청을 실패했습니다." + err);
    }
  }

  return (
    <div className={style.changeNickName_page}>
      <div className={style.changeNickName_title_wrap}>
        <h3 className={style.changeNickName_title}>닉네임 변경</h3>
      </div>
      <div className={style.changeNickName_content_wrap}>
        <div className={`${style.nickName_box} ${style.input_warp}`}>
          <div className={`${style.nickName_input_wrap}`}>
            <input className={`${style.nickName_input} ${style.content_input}`} id="nickName" type="text" onChange={(e) => setNickName(e.target.value)} value={nickName} placeholder=''></input>
            <label className={`${style.nickName_input_label} ${style.content_input_label}`} htmlFor="nickName" aria-hidden="true">닉네임</label>
          </div>
          <div className={style.nickName_check_wrap}>
            {nickName ? checkWrap(nickNameValid) : checkWrap("default")}
            <button className={`${style.nickName_check_button} ${nickNameValid ? style.actived_button : style.disabled_button}`} disabled={nickNameValid ? false : true} onClick={() => {checkNickNameDuplicate()}}>중복확인</button>
          </div>
        </div>
        <div className={style.nickNameChange_button_wrap}>
          <button className={`${style.nickNameChange_button} ${nickNameValid ? style.actived_button : style.disabled_button}`} disabled={nickNameValid ? false : true} onClick={() => {changeNickName()}}>닉네임 변경</button>
        </div>
      </div>
    </div>
  )
}
