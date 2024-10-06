import React, { useState } from 'react'
import style from '../styles/product.module.css';

import { IoMdAdd } from "react-icons/io";

export default function Product() {

  const [productTitle, setProductTitle] = useState("");
  const [productName, setProductName] = useState("");
  const [images, setImages] = useState([]);
  const [vidoe, setVideo] = useState(null);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className={style.productAdd_page}>
      <div className={style.productAdd_content}>
        <div className={style.page_title_wrap}>
          <h2 className={style.page_title}>상품 등록</h2>
        </div>
        <div className={style.product_title_wrap}>
          <p className={style.product_title}>제목</p>
          <input className={style.product_title_input} type="text" onChange={(e) => setProductTitle(e.target.value)} value={productTitle}></input>
        </div>
        <div className={style.product_name_wrap}>
          <p className={style.product_name_title}>상품 이름</p>
          <input className={style.product_name_input} type="text" onChange={(e) => setProductName(e.target.value)} value={productName}></input>
        </div>
        <div className={style.product_content_wrap}>
          <div className={style.product_image_wrap}>
            <p className={style.product_image_title}>상품 이미지</p>
            <div className={style.product_select_image_box}>
              <div className={style.add_product_image_button_warp}>
                <button className={style.add_product_image_button}>
                  <IoMdAdd className={style.add_product_image_button_icon}/>
                </button>
              </div>
              <div className={style.product_select_image_wrap}>
                <img className={style.product_select_image} src='/Users/giho/Desktop/다운로드 (1)js.jpeg'></img>
              </div>
              <div className={style.product_select_image_wrap}>
                <img className={style.product_select_image} src='/Users/giho/Desktop/2e3a2f8b554a5.jpeg'></img>
              </div>
              <div className={style.product_select_image_wrap}>
                <img className={style.product_select_image} src='/Users/giho/Desktop/스크린샷 2024-09-12 오후 5.07.40.png'></img>
              </div>
              <div className={style.product_select_image_wrap}>
                <img className={style.product_select_image} src='/Users/giho/Desktop/플라스크.png'></img>
              </div>
              <div className={style.product_select_image_wrap}>
                <img className={style.product_select_image} src='/Users/giho/Desktop/IMG_0413.JPG'></img>
              </div>
            </div>
          </div>
          <div className={style.product_video_wrap}>
            <p className={style.product_video_title}>상품 동영상</p>
            <div className={style.product_select_video_wrap}>
              <div className={style.product_select_video_button_wrap}>
                <button className={style.add_product_video_button}>
                  <IoMdAdd className={style.add_product_video_button_icon}/>
                </button>
              </div>
              <div className={style.product_select_video_wrap}>
                <video className={style.product_video} src='/Users/giho/Desktop/화면 기록 2024-09-12 오후 5.09.49.mov'></video>
              </div>
            </div>
          </div>
        </div>
        <div className={style.product_info_wrap}>
          <div className={style.product_detail_info_wrap}>
            <div className={style.product_detail_info_top_wrap}>
              <div className={style.product_category_wrap}>
                <p className={style.product_category_title}>카테고리</p>
                <input className={style.product_category_input} type="text" onChange={(e) => {setCategory(e.target.value)}} value={category}></input>
              </div>
              <div className={style.product_price_wrap}>
                <p className={style.product_price_title}>대여가격</p>
                <input className={style.product_price_input} type="text" onChange={(e) => {setPrice(e.target.value)}} value={price}></input>
              </div>
            </div>
            <div className={style.product_detail_info_bottom_wrap}>
              <p className={style.product_lent_period_title}>대여 가능 날짜</p>
              <div className={style.product_lent_period_select_wrap}>
                <input className={style.start_date} type="date" onChange={(e) => {setStartDate(e.target.value)}} value={startDate}></input>
                <p>~</p>
                <input className={style.end_date} type="date" onChange={(e) => {setEndDate(e.target.value)}} value={endDate}></input>
              </div>
            </div>
          </div>
          <div className={style.product_price_graph_wrap}>
            <p className={style.product_price_graph_title}>유사 상품 가격 분포</p>
            <img className={style.product_price_graph_image} src="/Users/giho/Desktop/플라스크.png"></img>
          </div>
        </div>
        <div className={style.product_description_wrap}>
          <textarea className={style.product_description} onChange={(e) => {setDescription(e.target.value)}} value={description}></textarea>
        </div>
        <div className={style.product_add_button_wrap}>
          <button className={style.product_add_button} onClick={() => {}}></button>
        </div>
      </div>
    </div>
  )
}
