import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import style from "../styles/findIdResult.module.css"

export default function FindIdResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { inputName, foundId } = location.state || { inputName: null, foundId: null }; // 전달받은 아이디를 받음

  return (
    <div className={style.findIdResult_page}>
      <div className={style.findIdResult_title_wrap}>
        <h2 className={style.findIdResult_title}>아이디 찾기</h2>
      </div>
      <div className={style.findIdResult_result_wrap}>
        {foundId ? (
          <p className={style.findIdResult_result}>{inputName}님의 아이디는 <br/><br/> <span className={style.foundId_result}>{foundId}</span> <br/><br/> 입니다.</p>
        ) : (
        <p className={style.findIdResult_result}>아이디를 찾을 수 없습니다.</p>
        )}
      </div>
      <div className={style.findIdResult_button_wrap}>
        <button className={style.reFind_button} onClick={() => ( navigate("/findId") )}>다시 찾기</button>
        <button className={style.close_button} onClick={() => ( window.open('','_self').close() )}>확인</button>
      </div>
    </div>
  )
}
