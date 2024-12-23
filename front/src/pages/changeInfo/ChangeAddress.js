import React, { useEffect, useState } from 'react';

import style from "../../styles/changeInfo/changeAddress.module.css";

import { IoIosClose } from "react-icons/io";
import DaumPostcode from 'react-daum-postcode';
import axios from 'axios';

import { API_BASE_URL } from '../../utils/constants';

export default function ChangeAddress() {

  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [addressValid, setAddressValid] = useState(false);

  // 다음 주소찾기 API
  // 스타일 정의
  const [modalState, setModalState] = useState(false);

  const daumpostcodeWindowStyle = {
    display: modalState ? "block" : "none",
  };

  const postCodeStyle = {
    width: "340px",
    height: "370px",
    display: modalState ? "block" : "none",
  };

  const onCompletePost = data => {
    setModalState(false);
    setAddress(data.address);
    setZipCode(data.zonecode);
  }

  const openPostcodeModal = () => {
    // 모달 열기
    setModalState(true);
  }

  useEffect(() => {
    if(address && zipCode && detailAddress) {
      setAddressValid(true);
    } else {
      setAddressValid(false);
    }
  }, [address, zipCode, detailAddress]);

  const changeAddress = async () => {
    const fullAddress = `${address} ${detailAddress} (${zipCode})`;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_BASE_URL}/api/users/changeAddress`, {
        address: fullAddress
      },
      {
       headers: {
        'Authorization': `Bearer ${token}`,
       } 
      });
      console.log("response: ", response.data);
      if(response && response.data === true) {
        alert("주소가 변경되었습니다.");

        window.location.reload();
      } else {
        alert("주소가 변경되지 않았습니다..");

        window.location.reload();
      }
    } catch (err) {
      alert("서버에 요청을 실패했습니다." + err);
    }
  }

  return (
    <div className={style.changeAddress_page}>
      <div className={style.changeAddress_title_wrap}>
        <h3 className={style.changeAddress_title}>주소 변경</h3>
      </div>
      <div className={style.changeAddress_content_wrap}>
        <div className={`${style.address_input_wrap} ${style.input_wrap}`}>
          <div className={style.address_top_wrap}>
            <div className={style.address_top_input_wrap}>
              <div className={style.address_wrap}>
                <input className={`${style.address_input} ${style.content_input}`} id="address" type="text" onChange={(e) => setAddress(e.target.value)} value={address} placeholder='' readOnly></input>
                <label className={`${style.address_input_label} ${style.content_input_label}`} htmlFor="address" aria-hidden="true">주소</label>
              </div>
              <div className={style.zipCode_wrap}>
                <input className={`${style.zipCode_input} ${style.content_input}`} id="zipCode" type="text" onChange={(e) => setZipCode(e.target.value)} value={zipCode} placeholder='' readOnly></input>
                <label className={`${style.zipCode_input_label} ${style.content_input_label}`} htmlFor="zipCode" aria-hidden="true">우편번호</label>
              </div>
              <div className={style.address_search_button_wrap}>
                <button className={style.address_search_button} onClick={() => openPostcodeModal()}>주소찾기</button>
              </div>
            </div>
          </div>
          <div className={style.address_bottom_wrap}>
            <div className={style.detailAddress_wrap}>
              <input className={`${style.detailAddress_input} ${style.content_input}`} id="detailAddress" type="text" onChange={(e) => setDetailAddress(e.target.value)} value={detailAddress} placeholder=''></input>
              <label className={`${style.detailAddress_input_label} ${style.content_input_label}`} htmlFor="detailAddress" aria-hidden="true">상세주소</label>
            </div>
          </div>
        </div>
        <div className={style.addressChange_button_wrap}>
          <button className={`${style.addressChange_button} ${addressValid ? style.actived_button : style.disabled_button}`} disabled={addressValid ? false : true} onClick={() => {changeAddress()}}>주소 변경</button>
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
