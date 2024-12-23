import React, { useContext, useEffect, useState } from 'react'

import style from "../styles/imageSearchResult.module.css"
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';

import SearchProductBox from '../components/SearchProductBox';
import Loading from '../components/Loading';
import { SearchContext } from '../components/SearchProvider';

import { API_BASE_URL } from '../utils/constants';

export default function ImageSearchResult() {
  const { searchState, setSearchState } = useContext(SearchContext);

  const [productList, setProductList] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [removeBgImage, setRemoveBgImage] = useState(null); // 응답 파일 객체 저장
  const [findImages, setFindImages] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");

  const [imageLoading, setImageLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);

  
  const location = useLocation(); // navigate로 전달된 데이터 접근
  // const products = location.state.productList || [] // 만약 state가 없을 경우 빈 배열로 처리

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

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  // 이미지 전송 및 응답 받기
  const handleRemoveBg = async () => {
    setImageLoading(true);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const responseImage = await axios.post(`${API_BASE_URL}/api/images/removeBg`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // 이미지 파일로 응답 받기
      });
        try {
          const responseCategory = await axios.post(`${API_BASE_URL}/api/images/predict`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const [firstPart, secondPart] = responseCategory.data.category.split("-");
          setCategory(firstPart);
          setName(secondPart);
        } catch (err) {
          console.error("카테고리 분류 오류:", err);
          alert("카테고리 분류에 실패했습니다.");
        }
      // 응답 이미지를 파일 객체로 저장
      const file = new File([responseImage.data], "background-removed.png", { type: "image/png" });
      setImageLoading(false);
      setRemoveBgImage(file);
      setSearchState({
        searchImage: file,
      });
    } catch (err) {
      console.error("이미지 업로드 오류:", err);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleImageSearch = async () => {
    setProductLoading(true);

    const formData = new FormData();
    formData.append("file", removeBgImage);
    formData.append("category", category);
    formData.append("name", name);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/images/similarity`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // 유사한 제품 결과를 findImages 상태에 저장
      setProductLoading(false);
      // setProductList(response.data);
      setSearchState({
        query: "",
        searchImage: removeBgImage,
        similarityImageProduct: response.data,
      });
      console.log("유사 이미지 검색 결과: ", response.data);
      console.log("findImages: ", findImages);
    } catch (err) {
      console.error("이미지 업로드 오류:", err);
      alert("유사 이미지 업로드에 실패했습니다.");
    }
  }

  useEffect(() => {
    if (selectedImage) {
      handleRemoveBg();
    }
  }, selectedImage)

  // ImageSearchResult.js
  useEffect(() => {
    if (searchState.similarityImageProduct && searchState.similarityImageProduct.length > 0) {
      setProductList(searchState.similarityImageProduct);
    }
  }, [searchState]);


  return (
    <div className={style.imageSearchResult_page}>
      <div className={style.imageSearchResult_title_wrap}>
        <h1 className={style.imageSearchResult_title}>이미지 검색</h1>
      </div>
      <div className={style.imageSearchResult_content_wrap}>
        <div className={style.imageSearchResult_image_select_wrap}>
          <div className={style.imageSearchResult_image_select_title_wrap}>
            <h2 className={style.imageSearchResult_image_select_title}>검색할 이미지</h2>
          </div>
          <div className={style.selectImage_wrap}>
            {searchState.searchImage ? (
              <img className={style.selectImage} src={URL.createObjectURL(searchState.searchImage)} alt="선택한 이미지" />
            ) : (
              <>
                {imageLoading && (
                  <div className={style.image_loading_wrap}>
                    <Loading loading={imageLoading} />
                  </div>              
                )}
              </>
            )}
            
          </div>
          <div className={style.selectImage_button_wrap}>
            
            {searchState.searchImage ? (
              <>
                <label className={style.selectImage_button_label} for="file">
                  <div className={style.selectImage_button}>이미지 변경하기</div>
                </label>
              </>
            ) : (
              <>
                <label className={style.selectImage_button_label} for="file">
                  <div className={style.selectImage_button}>이미지 선택하기</div>
                </label>
              </>
            )}

            <input className={style.selectImage_input} type="file" name="file" id="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {searchState.searchImage && (
            <div className={style.searchImage_button_wrap}>
              <label className={style.searchImage_button_label} for="searchImage_button">
                <div className={style.searchImage_button} id="searchImage_button" onClick={() => {handleImageSearch();}}>이미지 검색하기</div>
              </label>
            </div>
          )}
        </div>
        <div className={style.imageSearchResult_result_wrap}>
          
          <div className={style.imageSearchResult_result}>
            {productLoading && (
              <div className={style.product_loading_wrap}>
                <Loading loading={productLoading} />
              </div>       
            )}
            {productList && currentItems.length > 0 ? (
              <>
                <div className={style.imageSearchResult_result_title_wrap}>
                  <h2 className={style.imageSearchResult_result_title}>이미지 검색 결과</h2>
                </div>
                {currentItems.map((product) => (
                  <SearchProductBox product={product} />
                ))}
              </>
            ) : (
              <>
                
              </>
            )}
          </div>
          {/* 페이지네이션 버튼 */}
          <div className={style.pagination}>
            {renderPaginationButtons()}
          </div>
        </div>
      </div>
    </div>
  )
}
