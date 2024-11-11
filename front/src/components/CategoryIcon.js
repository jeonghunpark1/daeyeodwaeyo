import React from 'react'
import { Tooltip } from "react-tooltip"

import camping from '../assets/icon/camping_icon.png'
import electronic from '../assets/icon/electronic_icon.png'
import tool from '../assets/icon/tool_icon.png'

import style from '../styles/categoryIcon.module.css'

export default function CategoryIcon({ type }) {



  const icon = (type) => {
    if (type === "캠핑") {
      return (
        <img className={style.icon} src={camping} alt='https://www.flaticon.com/kr/free-icons/'></img>
      )
    }
    else if (type === "전자제품") {
      return (
        <img className={style.icon} src={electronic} alt='https://www.flaticon.com/kr/free-icons/'></img>
      )
    }
    else if (type === "공구") {
      return (
        <img className={style.icon} src={tool} alt='https://www.flaticon.com/kr/free-icons/'></img>
      )
    }
  }
  
  return (
    <>
      <div className={style.icon_wrap} data-tooltip-content={type} data-tooltip-id="icon">
        {icon(type)}
      </div>
      <Tooltip
        id="icon"
        place="top"
      />
    </>
  )
}
