import React, { useState } from 'react'

import style from "../styles/searchResult.module.css"
import { useLocation } from 'react-router-dom'

export default function SearchResult() {

  const [oderBy, setOderBy] = useState("orderByLatest");

  const location = useLocation(); // navigate로 전달된 데이터 접근
  const productList = location.state.productList || [] // 만약 state가 없을 경우 빈 배열로 처리
  const query = location.state.query || "";

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 6; // 한 페이지에 보여줄 아이템 수

  // 페이지 수 계산
  const totalPages = Math.ceil(productList.length / itemsPerPage);

  // 현재 페이지에 보여줄 아이템 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productList.slice(indexOfFirstItem, indexOfLastItem);

  console.log("SearchResult / currentItems: ", productList);
  console.log("SearchResult / query: ", query);

  const requestProductImageURL = (productImage) => {
    const productImageURL = "http://localhost:8080/productImagePath/" + productImage;
    return productImageURL;
  };

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

  return (
    <div className={style.searchResult_page}>
      <div className={style.searchResult_title_wrap}>
        <h2 className={style.searchResult_title}>"{query}"&nbsp;&nbsp;검색 결과</h2>
      </div>
      
      

      <div className={style.searchResult_content_wrap}>

        <div className={style.searchResult_nav_wrap}>
          <div className={`${style.orderByLatest_result} ${style.searchResult_nav} ${oderBy === "orderByLatest" ? style.selected_nav : style.unselected_nav}`} onClick={() => {setOderBy("oderByLatest");}}>최신순</div>
          <div className={`${style.orderByHits_result} ${style.searchResult_nav} ${oderBy === "orderByHits" ? style.selected_nav : style.unselected_nav}`} onClick={() => {setOderBy("oderByHits");}}>조회순</div>
          <div className={`${style.orderByLike_result} ${style.searchResult_nav} ${oderBy === "orderByLike" ? style.selected_nav : style.unselected_nav}`} onClick={() => {setOderBy("oderByLike");}}>좋아요순</div>
          <div className={`${style.orderByHighPrice_result} ${style.searchResult_nav} ${oderBy === "orderByHighPrice" ? style.selected_nav : style.unselected_nav}`} onClick={() => {setOderBy("oderByHighPrice");}}>높은가격순</div>
          <div className={`${style.orderByLowPrice_result} ${style.searchResult_nav} ${oderBy === "orderByLowPrice" ? style.selected_nav : style.unselected_nav}`} onClick={() => {setOderBy("oderByLowPrice");}}>낮은가격순</div>
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

        {currentItems.length > 0 ? (
          <>
            {currentItems.map((product) => (
              <div className={style.product_box}>
                <div className={style.product_id} key={product.id}></div>
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
                    {product.price}원
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
