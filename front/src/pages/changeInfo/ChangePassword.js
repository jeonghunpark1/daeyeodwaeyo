import React from 'react'

import style from "../../styles/changeInfo/changePassword.module.css";

export default function ChangePassword() {
  return (
    <div className={style.changePassword_page}>
      <div className={style.changePassword_title_wrap}>
        <h2 className={style.changePassword_title}>비밀번호 변경</h2>
      </div>
    </div>
  )
}
