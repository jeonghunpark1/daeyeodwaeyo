import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import ProductBox from '../components/ProductBox';
import ShortBox from '../components/ShortBox';

import style from "../styles/main.module.css"
import CategoryIcon from '../components/CategoryIcon'
import { IoMdAdd } from "react-icons/io";

export default function Main() {

  const navigate = useNavigate();

  const [latestProduct, setLatestProduct] = useState([]);
  const [shortsList, setShortsList] = useState([]);
  
  useEffect(() => {
    fetchLatestProducts();
    fetchShortsList();
  }, []);

  const fetchLatestProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products/mainLatestProduct");
      setLatestProduct(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch latest products:", error);
    }
  };
  
  const fetchShortsList = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products/mainShorts");
      setShortsList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch latest products:", error);
    }
  };

  return (
    <div className={style.main_page}>
      <div className={style.main_content}>
        <div className={style.category_wrap}>
          <CategoryIcon type={"캠핑"} />
          <CategoryIcon type={"전자제품"} />
          <CategoryIcon type={"공구"} />
        </div>
        <div className={style.orderByLatest_product_area}>
          <div className={style.orderByLatest_product_title_wrap}>
            <h3 className={style.orderByLatest_product_title}>최근 등록된 물건</h3>
            <div className={style.moreProductView_button_wrap}>
              <button className={style.moreProductView_button} onClick={() => {navigate("/searchResult", { state: {query: "전체"} });}}>
                <IoMdAdd className={style.moreProductView_icon}/>더보기
              </button>
            </div>
          </div>        
          <div className={style.orderByLatest_product_box}>
            {latestProduct && latestProduct.map((product) => (
              <ProductBox product={product}/>
            ))}            
          </div>
        </div>
        <div className={style.shorts_area}>
          <div className={style.shorts_area_title_wrap}>
            <h3 className={style.shorts_area_title}>쇼츠</h3>
            <div className={style.moreShortsView_button_wrap}>
              <button className={style.moreShortsView_button} onClick={() => {navigate("/shorts");}}>
                <IoMdAdd className={style.moreShortsView_icon}/>더보기
              </button>
            </div>
          </div>
          <div className={style.shorts_box}>
            {shortsList && shortsList.map((short) => (
              <ShortBox short={short} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
