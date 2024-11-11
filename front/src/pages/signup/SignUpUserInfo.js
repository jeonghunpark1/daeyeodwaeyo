import React, { useState } from 'react'
import axios from 'axios';

import style from "../../styles/signup/signupUserInfo.module.css"
import input_style from "../../styles/login_signup_input.module.css"


import { IoIosClose } from "react-icons/io";
import DaumPostcode from 'react-daum-postcode';

export default function SignUpUserInfo({ setStateValue, getStateValue, setStateValid, getStateValid }) {

  const checkMessage = (type, isCorrect) => {
    // 검증 성공했을 때 나오는 메시지
    if (isCorrect == true) {
      if (type == "id") { 
        if (getStateValid("idOverlap") == true) {
          if (getStateValue("id") == getStateValue("availableId")) {
            return "사용 가능한 아이디입니다.";
          }
          else {
            return "다시 중복확인을 해주세요."
          }
        }
        else if (getStateValid("idOverlap") == false) {
          if (getStateValue("id") == getStateValue("availableId")) {
            return "이미 존재하는 아이디입니다.";
          }
          else {
            return "아이디 중복확인을 해주세요.";
          } 
        }
      }
      else if (type == "password") {
        return "비밀번호 사용이 가능합니다.";
      }
      else if (type == "rePassword") {
        return "비밀번호가 일치합니다.";
      }
      else if (type == "name") {
        return;
      }
      else if (type == "phoneNumber") {
        return;
      }
    }
    // 검증 실패했을 때 나오는 메시지
    else if (isCorrect == false) {
      if (type == "id") {
        if (getStateValid("idOverlap") == true) {
          return <p>네 글자 이상 작성하고 다시<br/>중복확인을 해주세요.</p>;
        }
        else if (getStateValid("idOverlap") == false) {
          return "네 글자 이상 작성해주세요.";
        }
      }
      else if (type == "password") {
        return <p>영문, 숫자, 특수문자 포함 <br/>8글자 이상 작성해주세요.</p>;
      }
      else if (type == "rePassword") {
        return "비밀번호가 일치하지 않습니다.";
      }
      else if (type == "name") {
        return "앞뒤 공백 없이 한 글자 이상 작성해주세요.";
      }
      else if (type == "phoneNumber") {
        return "'-' 없이 작성해주세요.";
      }
    }
    // 아이디 중복확인 눌렀을 때, 중복된 아이디면 나오는 메시지
    else if (type == "id" && isCorrect == "overlap") {
      return "중복된 아이디입니다.";
    }
    // 처음 보이는 메시지
    else if (isCorrect == "default") {
      if (type == "id") {
        return "";
      }
      else if (type == "password") {
        return <p>영문, 숫자, 특수문자 포함 <br/>8글자 이상 작성해주세요.</p>;
      }
      else if (type == "rePassword") {
        return ;
      }
      else if (type == "name") {
        return ;
      }
      else if (type == "phoneNumber") {
        return ;
      }
    }
  }

  const checkWrap = (type, isCorrect) => {
    if (type == "id") {
      if (getStateValid("idOverlap") == false) {
        if (isCorrect == true) {
          return (
            <div className={style.wrong_message_wrap}>
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
      else if (getStateValid("idOverlap") == true) {
        if (isCorrect == true) {
          if (getStateValue("id") == getStateValue("availableId")) {
            return (
              <div className={style.correct_message_wrap}>
                {checkMessage(type, isCorrect)}
              </div>
            );
          }
          else {
            return (
              <div className={style.wrong_message_wrap}>
                {checkMessage(type, isCorrect)}
              </div>
            );
          }
          
        }
        else if (isCorrect == false) {
          return (
            <div className={style.wrong_message_wrap}>
              {checkMessage(type, isCorrect)}
            </div>
          )
        }
        else if (isCorrect == "default") {
          return (
            <div className={style.default_message_wrap}>
              {checkMessage(type, isCorrect)}
            </div>
          );
        }
      }
    }
    else {
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
  }

  // const checkIdOverlap = () => {
  //   setStateValid("idOverlap", true);
  // }

  const checkIdDuplicate = async () => {
    const userId = getStateValue("id");
    try {
      const response = await axios.get('/api/users/idDuplicate', {
        params: {
          id: userId
        }
      },
      {withCredentials: true});
      setStateValid("idOverlap", !response.data);
      console.log("idOverlap reponse: ", getStateValid("idOverlap"));
      console.log("id: ", getStateValue("id"));
      setStateValue("availableId", userId);
      console.log("availableId: ", getStateValue("availableId"));
    } catch (error) {
      console.error("Error checking ID: ", error);
    }
  }

  // 다음 주소찾기 API
  // 스타일 정의
  const [modalState, setModalState] = useState(false);

  const daumpostcodeWindowStyle = {
    display: modalState ? "block" : "none",
  };

  const postCodeStyle = {
    width: "400px",
    height: "470px",
    display: modalState ? "block" : "none",
  };

  const onCompletePost = data => {
    setModalState(false);
    setStateValue("address", data.address);
    setStateValue("zipCode", data.zonecode);
  }

  const openPostcodeModal = () => {
    // 모달 열기
    setModalState(true);
  }

  return (
    <div className={style.signup_div}>
      <h1>
        회원 정보
      </h1>
      <div className={style.input_wrap_div}>
        <div className={`${style.id_box} ${input_style.input_wrap}`}>
          <div className={`${style.id_input_wrap}`}>
            <input className={`${style.id_input} ${input_style.content_input}`} id="id" type="text" onChange={(e) => {setStateValue("id", e.target.value);}} value={getStateValue("id")} placeholder=''></input>
            <label className={`${style.id_input_label} ${input_style.content_input_label}`} htmlFor="id" aria-hidden="true">아이디</label>
          </div>
          <div className={style.id_check_wrap}>
            {getStateValue("id") ? checkWrap("id", getStateValid("id")) : checkWrap("id", "default")}
            <button className={`${style.id_check_button} ${getStateValid("id") ? style.actived_button : style.disabled_button}`} disabled={getStateValid("id") ? false : true} onClick={(e) => {checkIdDuplicate();}}>중복확인</button>
          </div>
        </div>
        <div className={`${style.password_box} ${input_style.input_wrap}`}>
          <div className={`${style.password_input_wrap}`}>
            <input className={`${style.password_input} ${input_style.content_input}`} id="password" type="password" onChange={(e) => setStateValue("password", e.target.value)} value={getStateValue("password")} placeholder=''></input>
            <label className={`${style.password_input_label} ${input_style.content_input_label}`} htmlFor="password" aria-hidden="true">비밀번호</label>
          </div>
          <div className={style.password_check_wrap}>
            {getStateValue("password") ? checkWrap("password", getStateValid("password")) : checkWrap("password", "default")}
          </div>
        </div>
        <div className={`${style.re_password_box} ${input_style.input_wrap}`}>
          <div className={`${style.re_password_input_wrap}`}>
            <input className={`${style.re_password_input} ${input_style.content_input}`} id="rePassword" type="password" onChange={(e) => setStateValue("rePassword", e.target.value)} value={getStateValue("rePassword")} placeholder=''></input>
            <label className={`${style.re_password_input_label} ${input_style.content_input_label}`} htmlFor="rePassword" aria-hidden="true">비밀번호 확인</label>
          </div>
          <div className={style.re_password_check_wrap}>
            {getStateValue("rePassword") ? checkWrap("rePassword", getStateValid("rePassword")) : checkWrap("rePassword", "default")}
          </div> 
        </div>
        <div className={`${style.name_box} ${input_style.input_wrap}`}>
          <div className={`${style.name_input_wrap}`}>
            <input className={`${style.name_input} ${input_style.content_input}`} id="name" type="text" onChange={(e) => setStateValue("name", e.target.value)} value={getStateValue("name")} placeholder=''></input>
            <label className={`${style.name_input_label} ${input_style.content_input_label}`} htmlFor="name" aria-hidden="true">이름</label>
          </div>
          <div className={style.name_check_wrap}>
            {getStateValue("name") ? checkWrap("name", getStateValid("name")) : checkWrap("name", "default")}
          </div>
        </div>
        <div className={`${style.phone_box} ${input_style.input_wrap}`}>
          <div className={`${style.phone_input_wrap}`}>
            <input className={`${style.phoneNumber_input} ${input_style.content_input}`} id="phoneNumber" type="text" onChange={(e) => setStateValue("phoneNumber", e.target.value)} value={getStateValue("phoneNumber")} placeholder=''></input>
            <label className={`${style.phoneNumber_input_label} ${input_style.content_input_label}`} htmlFor="phoneNumber" aria-hidden="true">전화번호</label>
          </div>
          <div className={style.phone_check_wrap}>
            {getStateValue("phoneNumber") ? checkWrap("phoneNumber", getStateValid("phoneNumber")) : checkWrap("phoneNumber", "default")}
          </div>
        </div>
        
        <div className={`${style.address_input_wrap} ${input_style.input_wrap}`}>
          <div className={style.address_top_wrap}>
            <div className={style.address_top_input_wrap}>
              <div className={style.address_wrap}>
                <input className={`${style.address_input} ${input_style.content_input}`} id="address" type="text" onChange={(e) => setStateValue("address", e.target.value)} value={getStateValue("address")} placeholder='' readOnly></input>
                <label className={`${style.address_input_label} ${input_style.content_input_label}`} htmlFor="address" aria-hidden="true">주소</label>
              </div>
              <div className={style.zipCode_wrap}>
                <input className={`${style.zipCode_input} ${input_style.content_input}`} id="zipCode" type="text" onChange={(e) => setStateValue("zipCode", e.target.value)} value={getStateValue("zipCode")} placeholder='' readOnly></input>
                <label className={`${style.zipCode_input_label} ${input_style.content_input_label}`} htmlFor="zipCode" aria-hidden="true">우편번호</label>
              </div>
              <div className={style.address_search_button_wrap}>
                <button className={style.address_search_button} onClick={() => openPostcodeModal()}>주소찾기</button>
              </div>
            </div>
          </div>
          <div className={style.address_bottom_wrap}>
            <div className={style.detailAddress_wrap}>
              <input className={`${style.detailAddress_input} ${input_style.content_input}`} id="detailAddress" type="text" onChange={(e) => setStateValue("detailAddress", e.target.value)} value={getStateValue("detailAddress")} placeholder=''></input>
              <label className={`${style.detailAddress_input_label} ${input_style.content_input_label}`} htmlFor="detailAddress" aria-hidden="true">상세주소</label>
            </div>
          </div>
        </div>
      </div>
      {modalState && (
        <div className={style.daumpostcode_window} style={daumpostcodeWindowStyle}>
          <div className={style.daumpostcode_top}>
            <button className={style.close_window_button} onClick={() => setModalState(false)}>
              <IoIosClose className={style.close_icon}/>
            </button>
          </div>
          <DaumPostcode 
            className={style.daumpostcode}
            style={postCodeStyle}
            onComplete={onCompletePost}>
          </DaumPostcode>
        </div>
      )}
      {modalState && (
        <div className={style.daumpostcode_background} style={daumpostcodeWindowStyle}></div>
      )}
    </div>
  )
}
