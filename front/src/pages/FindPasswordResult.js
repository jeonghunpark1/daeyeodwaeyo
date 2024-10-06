import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import style from "../styles/findPasswordResult.module.css"

export default function FindIdResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { inputName, tempPassword } = location.state || { inputName: null, tempPassword: null }; // 전달받은 아이디를 받음

  return (
    <div className={style.findPasswordResult_page}>
      <div className={style.findPasswordResult_title_wrap}>
        <h2 className={style.findPasswordResult_title}>비밀번호 찾기</h2>
      </div>
      <div className={style.findPasswordResult_result_wrap}>
        {tempPassword ? (
          <p className={style.findPasswordResult_result}>{inputName}님의 임시 비밀번호는 <br/><br/> <span className={style.tempPassword_result}>{tempPassword}</span> <br/><br/> 입니다. <br/><br/> 로그인 후 비밀번호를 변경해주세요.</p>
        ) : (
        <p className={style.findPasswordResult_result}>아이디를 찾을 수 없습니다.</p>
        )}
      </div>
      <div className={style.findPasswordResult_button_wrap}>
        <button className={style.reFind_button} onClick={() => ( navigate("/findId") )}>다시 찾기</button>
        <button className={style.close_button} onClick={() => ( window.open('','_self').close() )}>확인</button>
      </div>
    </div>
  )
}
