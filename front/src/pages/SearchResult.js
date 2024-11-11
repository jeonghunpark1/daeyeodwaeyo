import React, { useEffect, useState } from 'react'

import style from "../styles/searchResult.module.css"
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';

export default function SearchResult() {

  const navigate = useNavigate();

  const [orderBy, setorderBy] = useState("orderByLatest");
  const [productList, setProductList] = useState([]);

  const location = useLocation(); // navigate로 전달된 데이터 접근
  // const products = location.state.productList || [] // 만약 state가 없을 경우 빈 배열로 처리
  
  const query = location.state.query || "";

  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 12; // 한 페이지에 보여줄 아이템 수

  // 페이지 수 계산
  const totalPages = Math.ceil(productList.length / itemsPerPage);

  // 현재 페이지에 보여줄 아이템 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productList.slice(indexOfFirstItem, indexOfLastItem);

  // console.log("SearchResult / currentItems: ", currentItems);
  // console.log("SearchResult / query: ", query);

  // useEffect(() => {
  //   if (location.state && location.state.productList) {
  //     setProductList(location.state.productList);
  //   }
  // }, [location.state])

  useEffect(() => {
    setKeyword(query);
  }, [query])

  useEffect(() => {
    if (keyword){
      console.log("keyword: ", keyword)
      handleOrderBy(orderBy);
    }
  }, [keyword])

  const requestProductImageURL = (productImage) => {
    const productImageURL = "http://localhost:8080/productImagePath/" + productImage;
    return productImageURL;
  };

  // price에 천단위 콤마 추가
  const priceAddComma = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // 페이지네이션 버튼 생성
  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button key={i} 
                className={`${style.pageButton} ${i === currentPage ? style.activePageButton : style.disablePageButton}`} 
                onClick={() => {setCurrentPage(i)}}>
          {i}
        </button>
      );
    }
    return buttons;
  };

  const handleOrderBy = async (type) => {
    let query = "";
    if (keyword === "전체") {
      query = "";
    } else {
      query = keyword;
    }
    try {
      const response = await axios.get("http://localhost:8080/api/products/searchByQuery", {
        params: { query, type }
      });
      // alert(type);
      setProductList(response.data);
    } catch (err) {
      console.log("error: ", err);
    }
  };

  const handleProductClick = (product_id) => {
    navigate("/productDetail", { state: {productId: product_id} })
  }

  useEffect(() => {
    if(keyword) {
      handleOrderBy(orderBy);
    }
  }, [orderBy])

  return (
    <div className={style.searchResult_page}>
      <div className={style.searchResult_title_wrap}>
        <h2 className={style.searchResult_title}>"{keyword}"&nbsp;&nbsp;검색 결과</h2>
      </div>
      
      <div className={style.searchResult_content_wrap}>

        <div className={style.searchResult_nav_wrap}>
          <div className={`${style.orderByLatest_result} ${style.searchResult_nav} ${orderBy === "orderByLatest" ? style.selected_nav : style.unselected_nav}`} onClick={() => {setorderBy("orderByLatest"); }}>최신순</div>
          <div className={`${style.orderByHits_result} ${style.searchResult_nav} ${orderBy === "orderByLook" ? style.selected_nav : style.unselected_nav}`} onClick={() => {setorderBy("orderByLook"); }}>조회순</div>
          <div className={`${style.orderByLike_result} ${style.searchResult_nav} ${orderBy === "orderByReview" ? style.selected_nav : style.unselected_nav}`} onClick={() => {setorderBy("orderByReview"); }}>후기순</div>
          <div className={`${style.orderByHighPrice_result} ${style.searchResult_nav} ${orderBy === "orderByHighPrice" ? style.selected_nav : style.unselected_nav}`} onClick={() => {setorderBy("orderByHighPrice"); }}>높은가격순</div>
          <div className={`${style.orderByLowPrice_result} ${style.searchResult_nav} ${orderBy === "orderByLowPrice" ? style.selected_nav : style.unselected_nav}`} onClick={() => {setorderBy("orderByLowPrice"); }}>낮은가격순</div>
        </div>

        {/* <div className={style.product_box}>
          <div className={style.product_image_wrap}>
            <img className={style.product_image} src="https://placehold.co/90x90" alt='상품 사진' />
          </div>
          <div className={style.product_title_wrap}>
            <p className={style.product_title}></p>
          </div>
          <div className={style.product_price_warp}>
            <p className={style.product_price}></p>
          </div>
        </div> */}

        {productList && currentItems.length > 0 ? (
          <>
            {currentItems.map((product) => (
              <div className={style.product_box} key={product.id} onClick={() => {handleProductClick(product.id)}}>
                <div className={style.product_id}></div>
                <div className={style.product_image_wrap}>
                  <img className={style.product_image} src={requestProductImageURL(product.imageUrl[0])} alt='상품 사진' />
                </div>
                <div className={style.product_info_wrap}>
                  <div className={style.product_title_wrap}>
                    {product.title}
                  </div>
                  <div className={style.product_category_name_wrap}>
                    <div className={style.product_category}>
                      {product.category}
                    </div>
                    <div className={style.product_name}>
                      {product.name}
                    </div>
                  </div>
                  <div className={style.product_price_wrap}>
                    {priceAddComma(product.price)}원
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            검색 결과가 없습니다.
          </>
        )}
      </div>

      {/* 페이지네이션 버튼 */}
      <div className={style.pagination}>
        {renderPaginationButtons()}
      </div>
    </div>
  )
}
